import bcrypt from 'bcryptjs';

import { registerUser } from '@/features/auth/application/auth.service';
import { createDailyReport } from '@/features/daily-reports/application/daily-report.service';
import type {
  CreateDailyReportInput,
  MenstruationPhase,
} from '@/features/daily-reports/domain/daily-report.types';
import type {
  AttachmentType,
  EquipmentType,
  GripType,
  StanceType,
  TrackableMetric,
} from '@/features/exercises/domain/exercise.types';
import { createWorkoutSession } from '@/features/workouts/application/workout.service';
import type {
  CreateWorkoutSessionInput,
  ExerciseEntryInput,
  ExerciseSetInput,
  WorkoutBlockInput,
} from '@/features/workouts/domain/workout.types';
import { closeMongooseRootConnection } from '@/infrastructure/db/mongoose.client';
import { getCoreExerciseModel } from '@/infrastructure/db/models/core-exercise.model';
import type {
  CoreExercise,
  CoreExerciseVariant,
} from '@/infrastructure/db/models/core-exercise.types';
import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import { getTenantDailyReportModel } from '@/infrastructure/db/models/tenant-daily-report.model';
import { getTenantHealthyHabitsModel } from '@/infrastructure/db/models/tenant-healthy-habits.model';
import { getTenantProfileModel } from '@/infrastructure/db/models/tenant-profile.model';
import { getTenantSettingsModel } from '@/infrastructure/db/models/tenant-settings.model';
import { getTenantWorkoutModel } from '@/infrastructure/db/models/tenant-workout.model';
import { initializeTenantDatabase } from '@/infrastructure/db/tenant-database.service';
import { demoUser } from '@/shared/testing/demo-user';

const DEMO_EMAIL = demoUser.email;
const DEMO_PASSWORD = demoUser.password;

const DEMO_PROFILE = {
  firstName: 'Anna',
  lastName: 'Nowak',
  birthDate: new Date('1994-07-12T00:00:00.000Z'),
  heightCm: 168,
  gender: 'female' as const,
  activityLevel: 'very_active' as const,
  favoriteExerciseSlugs: [
    'bench-press',
    'lat-pulldown',
    'back-squat',
    'romanian-deadlift',
  ],
  location: {
    provider: 'google_places' as const,
    placeId: 'ChIJywtkGTF2X0YRZnedZ9MnDag',
    displayName: 'Stockholm',
    formattedAddress: 'Stockholm, Sweden',
    latitude: 59.3327036,
    longitude: 18.0656255,
    countryCode: 'SE',
    country: 'Sweden',
    region: 'Stockholm County',
    city: 'Stockholm',
    locality: null,
    postalCode: null,
  },
};

const DEMO_GOALS = {
  averageSleepHoursPerDay: 7.5,
  regularSleepSchedule: true,
  stepsPerDay: 10000,
  waterLitersPerDay: 2.6,
  proteinGramsPerDay: 145,
  strengthWorkoutsPerWeek: 4,
  cardioMinutesPerWeek: 30,
};

const DEMO_SETTINGS = {
  language: demoUser.language,
  isDarkMode: false,
  unitSystem: 'metric' as const,
  trackMenstrualCycle: true,
  trackLibido: true,
};

const REQUIRED_EXERCISE_SLUGS = [
  'bench-press',
  'incline-bench-press',
  'lat-pulldown',
  'row',
  'back-squat',
  'romanian-deadlift',
  'lunge',
  'leg-press',
  'lateral-raise',
  'overhead-press',
  'pull-up',
] as const;

interface DemoUserContext {
  id: string;
  tenantDbName: string;
}

interface SeedExercise {
  id: string;
  name: string;
  slug: string;
  defaultVariant: SeedVariant;
}

interface SeedVariant {
  id: string;
  slug: string;
  equipment: EquipmentType[];
  trackableMetrics: TrackableMetric[];
  selectedGrip: GripType | null;
  selectedStance: StanceType | null;
  selectedAttachment: AttachmentType | null;
}

async function run(): Promise<void> {
  const demoUser = await ensureDemoUser();
  const exercises = await loadSeedExercises();

  await seedTenantDocuments(demoUser);
  await clearExistingReports(demoUser);
  await seedDailyReports(demoUser);
  await seedWorkoutReports(demoUser, exercises);

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        tenantDbName: demoUser.tenantDbName,
        seededDailyReports: 7,
        seededWorkoutReports: 4,
        favoriteExercises: DEMO_PROFILE.favoriteExerciseSlugs,
      },
      null,
      2,
    ),
  );
}

async function ensureDemoUser(): Promise<DemoUserContext> {
  const CoreUserModel = await getCoreUserModel();
  const existingUser = await CoreUserModel.findOne({ email: DEMO_EMAIL })
    .select('email isActive tenantDbName')
    .lean();

  if (!existingUser) {
    const registeredUser = await registerUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      firstName: DEMO_PROFILE.firstName,
      lastName: DEMO_PROFILE.lastName,
      language: DEMO_SETTINGS.language,
      isDarkMode: DEMO_SETTINGS.isDarkMode,
    });

    return {
      id: registeredUser.id,
      tenantDbName: registeredUser.tenantDbName,
    };
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  await CoreUserModel.updateOne(
    { _id: existingUser._id },
    {
      $set: {
        password: passwordHash,
        isActive: true,
      },
    },
  );

  await initializeTenantDatabase({
    tenantDbName: existingUser.tenantDbName,
    userId: existingUser._id.toString(),
    email: DEMO_EMAIL,
    firstName: DEMO_PROFILE.firstName,
    lastName: DEMO_PROFILE.lastName,
    language: DEMO_SETTINGS.language,
    isDarkMode: DEMO_SETTINGS.isDarkMode,
  });

  return {
    id: existingUser._id.toString(),
    tenantDbName: existingUser.tenantDbName,
  };
}

async function seedTenantDocuments(user: DemoUserContext): Promise<void> {
  const [TenantProfileModel, TenantSettingsModel, TenantHealthyHabitsModel] =
    await Promise.all([
      getTenantProfileModel(user.tenantDbName),
      getTenantSettingsModel(user.tenantDbName),
      getTenantHealthyHabitsModel(user.tenantDbName),
    ]);

  await TenantProfileModel.updateOne(
    { userId: user.id },
    {
      $set: {
        email: DEMO_EMAIL,
        firstName: DEMO_PROFILE.firstName,
        lastName: DEMO_PROFILE.lastName,
        birthDate: DEMO_PROFILE.birthDate,
        favoriteExerciseSlugs: DEMO_PROFILE.favoriteExerciseSlugs,
        location: DEMO_PROFILE.location,
        heightCm: DEMO_PROFILE.heightCm,
        gender: DEMO_PROFILE.gender,
        activityLevel: DEMO_PROFILE.activityLevel,
      },
    },
    { upsert: true },
  );

  await TenantSettingsModel.updateOne(
    { scope: 'tenant' },
    {
      $set: {
        language: DEMO_SETTINGS.language,
        isDarkMode: DEMO_SETTINGS.isDarkMode,
        unitSystem: DEMO_SETTINGS.unitSystem,
        trackMenstrualCycle: DEMO_SETTINGS.trackMenstrualCycle,
        trackLibido: DEMO_SETTINGS.trackLibido,
      },
    },
    { upsert: true },
  );

  await TenantHealthyHabitsModel.updateOne(
    { scope: 'tenant' },
    {
      $set: DEMO_GOALS,
    },
    { upsert: true },
  );
}

async function clearExistingReports(user: DemoUserContext): Promise<void> {
  const [TenantWorkoutModel, TenantDailyReportModel] = await Promise.all([
    getTenantWorkoutModel(user.tenantDbName),
    getTenantDailyReportModel(user.tenantDbName),
  ]);

  await TenantWorkoutModel.deleteMany({ userId: user.id });
  await TenantDailyReportModel.deleteMany({ userId: user.id });
}

async function loadSeedExercises(): Promise<Record<string, SeedExercise>> {
  const CoreExerciseModel = await getCoreExerciseModel();
  const exercises = await CoreExerciseModel.find({
    slug: { $in: [...REQUIRED_EXERCISE_SLUGS] },
    isActive: true,
  }).lean();

  const exerciseMap = new Map(
    exercises.map((exercise) => [exercise.slug, toSeedExercise(exercise)]),
  );

  for (const slug of REQUIRED_EXERCISE_SLUGS) {
    if (!exerciseMap.has(slug)) {
      throw new Error(`Missing required atlas exercise for demo seed: ${slug}`);
    }
  }

  return Object.fromEntries(exerciseMap.entries());
}

function toSeedExercise(exercise: CoreExercise): SeedExercise {
  const defaultVariant =
    exercise.variants.find((variant) => variant.isDefault) ?? exercise.variants[0];

  if (!defaultVariant) {
    throw new Error(`Exercise "${exercise.slug}" has no variants to seed.`);
  }

  return {
    id: exercise._id.toString(),
    name: exercise.name,
    slug: exercise.slug,
    defaultVariant: toSeedVariant(defaultVariant),
  };
}

function toSeedVariant(variant: CoreExerciseVariant): SeedVariant {
  return {
    id: variant._id.toString(),
    slug: variant.slug,
    equipment: variant.equipment as EquipmentType[],
    trackableMetrics: variant.trackableMetrics as TrackableMetric[],
    selectedGrip: (variant.gripOptions?.[0] as GripType | undefined) ?? null,
    selectedStance:
      (variant.stanceOptions?.[0] as StanceType | undefined) ?? null,
    selectedAttachment:
      (variant.attachmentOptions?.[0] as AttachmentType | undefined) ?? null,
  };
}

async function seedDailyReports(user: DemoUserContext): Promise<void> {
  const baseDate = new Date('2026-03-23T12:00:00.000Z');
  const dailyDrafts = [
    {
      daysAgo: 6,
      actuals: {
        sleepHours: 7.8,
        sleepScheduleKept: true,
        steps: 11240,
        waterLiters: 2.7,
        proteinGrams: 152,
        strengthWorkoutDone: true,
        cardioMinutes: 0,
      },
      wellbeing: {
        mood: 4,
        energy: 4,
        stress: 2,
        soreness: 2,
        libido: 3,
        motivation: 5,
        recovery: 4,
      },
      body: {
        bodyWeightKg: 66.8,
        restingHeartRate: 58,
      },
      dayContext: {
        temperatureC: 6,
        apparentTemperatureC: 3,
        weatherCode: 'cloudy',
        menstruationPhase: 'menstruation' as MenstruationPhase,
        illness: false,
        notes: 'Dobry start tygodnia i mocny trening klatki.',
      },
    },
    {
      daysAgo: 5,
      actuals: {
        sleepHours: 7.1,
        sleepScheduleKept: true,
        steps: 9780,
        waterLiters: 2.3,
        proteinGrams: 141,
        strengthWorkoutDone: false,
        cardioMinutes: 35,
      },
      wellbeing: {
        mood: 3,
        energy: 3,
        stress: 3,
        soreness: 3,
        libido: 2,
        motivation: 3,
        recovery: 3,
      },
      body: {
        bodyWeightKg: 66.7,
        restingHeartRate: 59,
      },
      dayContext: {
        temperatureC: 4,
        apparentTemperatureC: 1,
        weatherCode: 'rain',
        menstruationPhase: 'menstruation' as MenstruationPhase,
        illness: false,
        notes: 'Spokojniejszy dzień z cardio i spacerami.',
      },
    },
    {
      daysAgo: 4,
      actuals: {
        sleepHours: 7.6,
        sleepScheduleKept: true,
        steps: 12150,
        waterLiters: 2.8,
        proteinGrams: 160,
        strengthWorkoutDone: true,
        cardioMinutes: 10,
      },
      wellbeing: {
        mood: 4,
        energy: 4,
        stress: 2,
        soreness: 4,
        libido: 3,
        motivation: 5,
        recovery: 4,
      },
      body: {
        bodyWeightKg: 66.5,
        restingHeartRate: 57,
      },
      dayContext: {
        temperatureC: 7,
        apparentTemperatureC: 5,
        weatherCode: 'partly_cloudy',
        menstruationPhase: 'follicular' as MenstruationPhase,
        illness: false,
        notes: 'Dużo energii, mocna sesja nóg.',
      },
    },
    {
      daysAgo: 3,
      actuals: {
        sleepHours: 6.9,
        sleepScheduleKept: false,
        steps: 8640,
        waterLiters: 2.1,
        proteinGrams: 133,
        strengthWorkoutDone: false,
        cardioMinutes: 20,
      },
      wellbeing: {
        mood: 3,
        energy: 2,
        stress: 4,
        soreness: 4,
        libido: 2,
        motivation: 3,
        recovery: 2,
      },
      body: {
        bodyWeightKg: 66.4,
        restingHeartRate: 60,
      },
      dayContext: {
        temperatureC: 5,
        apparentTemperatureC: 2,
        weatherCode: 'windy',
        menstruationPhase: 'follicular' as MenstruationPhase,
        illness: false,
        notes: 'Mniej snu i wyraźne zmęczenie po pracy.',
      },
    },
    {
      daysAgo: 2,
      actuals: {
        sleepHours: 8.2,
        sleepScheduleKept: true,
        steps: 10920,
        waterLiters: 2.9,
        proteinGrams: 149,
        strengthWorkoutDone: true,
        cardioMinutes: 0,
      },
      wellbeing: {
        mood: 5,
        energy: 5,
        stress: 2,
        soreness: 3,
        libido: 4,
        motivation: 5,
        recovery: 5,
      },
      body: {
        bodyWeightKg: 66.3,
        restingHeartRate: 55,
      },
      dayContext: {
        temperatureC: 8,
        apparentTemperatureC: 8,
        weatherCode: 'sunny',
        menstruationPhase: 'ovulation' as MenstruationPhase,
        illness: false,
        notes: 'Świetna regeneracja i bardzo udany trening pull.',
      },
    },
    {
      daysAgo: 1,
      actuals: {
        sleepHours: 7.4,
        sleepScheduleKept: true,
        steps: 13040,
        waterLiters: 2.5,
        proteinGrams: 146,
        strengthWorkoutDone: false,
        cardioMinutes: 40,
      },
      wellbeing: {
        mood: 4,
        energy: 4,
        stress: 2,
        soreness: 2,
        libido: 4,
        motivation: 4,
        recovery: 4,
      },
      body: {
        bodyWeightKg: 66.2,
        restingHeartRate: 54,
      },
      dayContext: {
        temperatureC: 9,
        apparentTemperatureC: 9,
        weatherCode: 'sunny',
        menstruationPhase: 'luteal' as MenstruationPhase,
        illness: false,
        notes: 'Długi spacer i trochę cardio na świeżym powietrzu.',
      },
    },
    {
      daysAgo: 0,
      actuals: {
        sleepHours: 7.7,
        sleepScheduleKept: true,
        steps: 10120,
        waterLiters: 2.6,
        proteinGrams: 151,
        strengthWorkoutDone: true,
        cardioMinutes: 15,
      },
      wellbeing: {
        mood: 4,
        energy: 4,
        stress: 3,
        soreness: 3,
        libido: 3,
        motivation: 5,
        recovery: 4,
      },
      body: {
        bodyWeightKg: 66.1,
        restingHeartRate: 55,
      },
      dayContext: {
        temperatureC: 8,
        apparentTemperatureC: 6,
        weatherCode: 'cloudy',
        menstruationPhase: 'luteal' as MenstruationPhase,
        illness: false,
        notes: 'Krótki, sprawny trening full body po pracy.',
      },
    },
  ] as const;

  for (const draft of dailyDrafts) {
    const reportDate = daysAgoAtUtcHour(baseDate, draft.daysAgo, 11);

    await createDailyReport({
      tenantDbName: user.tenantDbName,
      userId: user.id,
      reportDate,
      goalsSnapshot: DEMO_GOALS,
      actuals: draft.actuals,
      wellbeing: draft.wellbeing,
      body: draft.body,
      dayContext: {
        weatherSnapshot: {
          provider: 'demo_weather',
          temperatureC: draft.dayContext.temperatureC,
          apparentTemperatureC: draft.dayContext.apparentTemperatureC,
          humidityPercent: 68 - draft.daysAgo,
          windSpeedKph: 12 + draft.daysAgo,
          precipitationMm: draft.dayContext.weatherCode === 'rain' ? 2.4 : 0,
          weatherCode: draft.dayContext.weatherCode,
          capturedAt: reportDate,
        },
        menstruationPhase: draft.dayContext.menstruationPhase,
        illness: draft.dayContext.illness,
        notes: draft.dayContext.notes,
      },
      completion: {
        sleepGoalMet:
          draft.actuals.sleepHours >= DEMO_GOALS.averageSleepHoursPerDay &&
          draft.actuals.sleepScheduleKept === true,
        stepsGoalMet: draft.actuals.steps >= DEMO_GOALS.stepsPerDay,
        waterGoalMet: draft.actuals.waterLiters >= DEMO_GOALS.waterLitersPerDay,
        proteinGoalMet:
          draft.actuals.proteinGrams >= DEMO_GOALS.proteinGramsPerDay,
        cardioGoalMet:
          draft.actuals.cardioMinutes >= DEMO_GOALS.cardioMinutesPerWeek,
      },
    });
  }
}

async function seedWorkoutReports(
  user: DemoUserContext,
  exercises: Record<string, SeedExercise>,
): Promise<void> {
  const baseDate = new Date('2026-03-23T12:00:00.000Z');
  const workoutDrafts: Array<{
    daysAgo: number;
    workoutName: string;
    durationMinutes: number;
    notes: string;
    temperatureC: number;
    blocks: WorkoutBlockInput[];
  }> = [
    {
      daysAgo: 6,
      workoutName: 'Upper Strength',
      durationMinutes: 72,
      notes: 'Klasyczny mocniejszy push-pull.',
      temperatureC: 6,
      blocks: [
        createSingleBlock(
          1,
          'Main press',
          [
            createExerciseEntry(exercises['bench-press'], 1, [
              createSet(1, { reps: 8, weight: 52.5, rpe: 7, rir: 3 }),
              createSet(2, { reps: 8, weight: 55, rpe: 8, rir: 2 }),
              createSet(3, { reps: 6, weight: 57.5, rpe: 8.5, rir: 1 }),
            ]),
          ],
          150,
        ),
        createSingleBlock(
          2,
          'Vertical pull',
          [
            createExerciseEntry(exercises['lat-pulldown'], 1, [
              createSet(1, { reps: 12, weight: 42.5, rpe: 7, rir: 3 }),
              createSet(2, { reps: 10, weight: 45, rpe: 8, rir: 2 }),
              createSet(3, { reps: 10, weight: 45, rpe: 8.5, rir: 1 }),
            ]),
          ],
          120,
        ),
        createSupersetBlock(3, 'Shoulders + rows', [
          createExerciseEntry(exercises['lateral-raise'], 1, [
            createSet(1, { reps: 15, weight: 7, rpe: 8, rir: 2 }),
            createSet(2, { reps: 15, weight: 7, rpe: 8.5, rir: 1 }),
            createSet(3, { reps: 12, weight: 8, rpe: 9, rir: 1 }),
          ]),
          createExerciseEntry(exercises['row'], 2, [
            createSet(1, { reps: 12, weight: 24, rpe: 7.5, rir: 2 }),
            createSet(2, { reps: 12, weight: 26, rpe: 8, rir: 2 }),
            createSet(3, { reps: 10, weight: 28, rpe: 8.5, rir: 1 }),
          ]),
        ]),
      ],
    },
    {
      daysAgo: 4,
      workoutName: 'Lower Body Day',
      durationMinutes: 78,
      notes: 'Cięższy dół z akcentem na tylną taśmę.',
      temperatureC: 7,
      blocks: [
        createSingleBlock(
          1,
          'Squat focus',
          [
            createExerciseEntry(exercises['back-squat'], 1, [
              createSet(1, { reps: 5, weight: 67.5, rpe: 7.5, rir: 2 }),
              createSet(2, { reps: 5, weight: 70, rpe: 8, rir: 2 }),
              createSet(3, { reps: 4, weight: 72.5, rpe: 9, rir: 1 }),
            ]),
          ],
          180,
        ),
        createSingleBlock(
          2,
          'Hinge focus',
          [
            createExerciseEntry(exercises['romanian-deadlift'], 1, [
              createSet(1, { reps: 10, weight: 55, rpe: 7.5, rir: 2 }),
              createSet(2, { reps: 10, weight: 57.5, rpe: 8, rir: 2 }),
              createSet(3, { reps: 8, weight: 60, rpe: 8.5, rir: 1 }),
            ]),
          ],
          150,
        ),
        createCircuitBlock(3, 'Leg finisher', 3, [
          createExerciseEntry(exercises['leg-press'], 1, [
            createSet(1, { reps: 15, weight: 110, rpe: 8, rir: 2 }),
            createSet(2, { reps: 15, weight: 110, rpe: 8.5, rir: 1 }),
            createSet(3, { reps: 12, weight: 120, rpe: 9, rir: 1 }),
          ]),
          createExerciseEntry(exercises['lunge'], 2, [
            createSet(1, { reps: 12, weight: 12, rpe: 8, rir: 2 }),
            createSet(2, { reps: 12, weight: 12, rpe: 8.5, rir: 1 }),
            createSet(3, { reps: 10, weight: 14, rpe: 9, rir: 1 }),
          ]),
        ]),
      ],
    },
    {
      daysAgo: 2,
      workoutName: 'Pull Hypertrophy',
      durationMinutes: 64,
      notes: 'Więcej objętości i dropset na barki.',
      temperatureC: 8,
      blocks: [
        createSingleBlock(
          1,
          'Pull-up practice',
          [
            createExerciseEntry(exercises['pull-up'], 1, [
              createSet(1, { reps: 6, weight: null, rpe: 8, rir: 2 }),
              createSet(2, { reps: 5, weight: null, rpe: 8.5, rir: 1 }),
              createSet(3, { reps: 5, weight: null, rpe: 9, rir: 1 }),
            ]),
          ],
          120,
        ),
        createSupersetBlock(2, 'Back density', [
          createExerciseEntry(exercises['row'], 1, [
            createSet(1, { reps: 10, weight: 40, rpe: 8, rir: 2 }),
            createSet(2, { reps: 10, weight: 42.5, rpe: 8.5, rir: 1 }),
            createSet(3, { reps: 8, weight: 45, rpe: 9, rir: 1 }),
          ]),
          createExerciseEntry(exercises['lat-pulldown'], 1, [
            createSet(1, { reps: 12, weight: 45, rpe: 8, rir: 2 }),
            createSet(2, { reps: 10, weight: 47.5, rpe: 8.5, rir: 1 }),
            createSet(3, { reps: 10, weight: 47.5, rpe: 9, rir: 1 }),
          ]),
        ]),
        createDropsetBlock(3, 'Lateral raise dropset', [
          createExerciseEntry(exercises['lateral-raise'], 1, [
            createSet(1, { reps: 14, weight: 8, rpe: 9, rir: 1, setKind: 'top' }),
            createSet(2, {
              reps: 12,
              weight: 6,
              rpe: 9,
              rir: 0,
              setKind: 'drop',
              parentSetOrder: 1,
            }),
            createSet(3, {
              reps: 12,
              weight: 4,
              rpe: 10,
              rir: 0,
              setKind: 'drop',
              parentSetOrder: 1,
              isFailure: true,
            }),
          ]),
        ]),
      ],
    },
    {
      daysAgo: 0,
      workoutName: 'Full Body Express',
      durationMinutes: 52,
      notes: 'Krótki trening po pracy, bardziej techniczny.',
      temperatureC: 8,
      blocks: [
        createCircuitBlock(1, 'Main circuit', 3, [
          createExerciseEntry(exercises['incline-bench-press'], 1, [
            createSet(1, { reps: 10, weight: 40, rpe: 7.5, rir: 2 }),
            createSet(2, { reps: 10, weight: 42.5, rpe: 8, rir: 2 }),
            createSet(3, { reps: 8, weight: 45, rpe: 8.5, rir: 1 }),
          ]),
          createExerciseEntry(exercises['back-squat'], 1, [
            createSet(1, { reps: 8, weight: 55, rpe: 7.5, rir: 2 }),
            createSet(2, { reps: 8, weight: 57.5, rpe: 8, rir: 2 }),
            createSet(3, { reps: 6, weight: 60, rpe: 8.5, rir: 1 }),
          ]),
          createExerciseEntry(exercises['overhead-press'], 1, [
            createSet(1, { reps: 10, weight: 25, rpe: 7.5, rir: 2 }),
            createSet(2, { reps: 8, weight: 27.5, rpe: 8, rir: 2 }),
            createSet(3, { reps: 8, weight: 27.5, rpe: 8.5, rir: 1 }),
          ]),
        ]),
      ],
    },
  ];

  for (const draft of workoutDrafts) {
    const startedAt = daysAgoAtUtcHour(baseDate, draft.daysAgo, 17);
    const endedAt = new Date(
      startedAt.getTime() + draft.durationMinutes * 60 * 1000,
    );

    await createWorkoutSession({
      tenantDbName: user.tenantDbName,
      userId: user.id,
      workoutName: draft.workoutName,
      startedAt,
      endedAt,
      durationMinutes: draft.durationMinutes,
      performedAt: startedAt,
      notes: draft.notes,
      locationSnapshot: DEMO_PROFILE.location,
      weatherSnapshot: {
        provider: 'demo_weather',
        temperatureC: draft.temperatureC,
        apparentTemperatureC: draft.temperatureC - 1,
        humidityPercent: 64,
        windSpeedKph: 14,
        precipitationMm: 0,
        weatherCode: 'partly_cloudy',
        capturedAt: startedAt,
      },
      blocks: draft.blocks,
    });
  }
}

function createSingleBlock(
  order: number,
  name: string,
  entries: ExerciseEntryInput[],
  restAfterBlockSec: number,
): WorkoutBlockInput {
  return {
    order,
    type: 'single',
    name,
    rounds: null,
    restAfterBlockSec,
    entries,
  };
}

function createSupersetBlock(
  order: number,
  name: string,
  entries: ExerciseEntryInput[],
): WorkoutBlockInput {
  return {
    order,
    type: 'superset',
    name,
    rounds: 3,
    restAfterBlockSec: 90,
    entries,
  };
}

function createCircuitBlock(
  order: number,
  name: string,
  rounds: number,
  entries: ExerciseEntryInput[],
): WorkoutBlockInput {
  return {
    order,
    type: 'circuit',
    name,
    rounds,
    restAfterBlockSec: 75,
    entries,
  };
}

function createDropsetBlock(
  order: number,
  name: string,
  entries: ExerciseEntryInput[],
): WorkoutBlockInput {
  return {
    order,
    type: 'dropset',
    name,
    rounds: null,
    restAfterBlockSec: 60,
    entries,
  };
}

function createExerciseEntry(
  exercise: SeedExercise,
  order: number,
  sets: ExerciseSetInput[],
): ExerciseEntryInput {
  return {
    order,
    exerciseId: exercise.id,
    exerciseSlug: exercise.slug,
    variantId: exercise.defaultVariant.id,
    trackableMetrics: exercise.defaultVariant.trackableMetrics,
    selectedEquipment: exercise.defaultVariant.equipment,
    selectedGrip: exercise.defaultVariant.selectedGrip,
    selectedStance: exercise.defaultVariant.selectedStance,
    selectedAttachment: exercise.defaultVariant.selectedAttachment,
    notes: null,
    restAfterEntrySec: 60,
    sets,
  };
}

function createSet(
  order: number,
  input: {
    reps: number | null;
    weight: number | null;
    rpe: number | null;
    rir: number | null;
    setKind?: ExerciseSetInput['setKind'];
    parentSetOrder?: number | null;
    isFailure?: boolean;
  },
): ExerciseSetInput {
  return {
    order,
    reps: input.reps,
    weight: input.weight,
    durationSec: null,
    distanceMeters: null,
    calories: null,
    rpe: input.rpe,
    rir: input.rir,
    isWarmup: false,
    isFailure: input.isFailure ?? false,
    setKind: input.setKind ?? 'normal',
    parentSetOrder: input.parentSetOrder ?? null,
    completedAt: null,
  };
}

function daysAgoAtUtcHour(baseDate: Date, daysAgo: number, hour: number): Date {
  return new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate() - daysAgo,
      hour,
      0,
      0,
      0,
    ),
  );
}

run()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongooseRootConnection();
  });
