import bcrypt from 'bcryptjs';

import { registerUser } from '@/features/auth/application/auth.service';
import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import { getTenantDailyReportModel } from '@/infrastructure/db/models/tenant-daily-report.model';
import { getTenantHealthyHabitsModel } from '@/infrastructure/db/models/tenant-healthy-habits.model';
import { getTenantProfileModel } from '@/infrastructure/db/models/tenant-profile.model';
import { getTenantSettingsModel } from '@/infrastructure/db/models/tenant-settings.model';
import { getTenantSupplementReportModel } from '@/infrastructure/db/models/tenant-supplement-report.model';
import { getTenantSupplementStackModel } from '@/infrastructure/db/models/tenant-supplement-stack.model';
import { getTenantWorkoutTemplateModel } from '@/infrastructure/db/models/tenant-workout-template.model';
import { getTenantWorkoutModel } from '@/infrastructure/db/models/tenant-workout.model';
import { closeMongooseRootConnection } from '@/infrastructure/db/mongoose.client';
import { initializeTenantDatabase } from '@/infrastructure/db/tenant-database.service';
import { cypressUser } from '@/shared/testing/cypress-user';

type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

interface CypressUserContext {
  id: string;
  tenantDbName: string;
}

async function run(): Promise<void> {
  const generated = createRandomSeedData();
  const user = await ensureCypressUser(generated);

  await seedTenantDocuments(user, generated);
  await clearTenantData(user);

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        email: cypressUser.email,
        password: cypressUser.password,
        language: cypressUser.language,
        tenantDbName: user.tenantDbName,
        profile: generated.profile,
        goals: generated.goals,
      },
      null,
      2,
    ),
  );
}

async function ensureCypressUser(
  generated: ReturnType<typeof createRandomSeedData>,
): Promise<CypressUserContext> {
  const CoreUserModel = await getCoreUserModel();
  const existingUser = await CoreUserModel.findOne({ email: cypressUser.email })
    .select('email isActive tenantDbName')
    .lean();

  if (!existingUser) {
    const registeredUser = await registerUser({
      email: cypressUser.email,
      password: cypressUser.password,
      firstName: generated.profile.firstName,
      lastName: generated.profile.lastName,
      language: cypressUser.language,
      isDarkMode: generated.settings.isDarkMode,
    });

    await CoreUserModel.updateOne(
      { _id: registeredUser.id },
      {
        $set: {
          isActive: true,
          emailVerifiedAt: new Date(),
          emailVerificationTokenHash: null,
          emailVerificationTokenExpiresAt: null,
        },
      },
    );

    return {
      id: registeredUser.id,
      tenantDbName: registeredUser.tenantDbName,
    };
  }

  const passwordHash = await bcrypt.hash(cypressUser.password, 12);

  await CoreUserModel.updateOne(
    { _id: existingUser._id },
    {
      $set: {
        password: passwordHash,
        isActive: true,
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
    },
  );

  await initializeTenantDatabase({
    tenantDbName: existingUser.tenantDbName,
    userId: existingUser._id.toString(),
    email: cypressUser.email,
    firstName: generated.profile.firstName,
    lastName: generated.profile.lastName,
    language: cypressUser.language,
    isDarkMode: generated.settings.isDarkMode,
  });

  return {
    id: existingUser._id.toString(),
    tenantDbName: existingUser.tenantDbName,
  };
}

async function seedTenantDocuments(
  user: CypressUserContext,
  generated: ReturnType<typeof createRandomSeedData>,
): Promise<void> {
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
        email: cypressUser.email,
        ...generated.profile,
      },
    },
    { upsert: true },
  );

  await TenantSettingsModel.updateOne(
    { scope: 'tenant' },
    {
      $set: generated.settings,
    },
    { upsert: true },
  );

  await TenantHealthyHabitsModel.updateOne(
    { scope: 'tenant' },
    {
      $set: generated.goals,
    },
    { upsert: true },
  );
}

async function clearTenantData(user: CypressUserContext): Promise<void> {
  const [
    TenantDailyReportModel,
    TenantWorkoutModel,
    TenantWorkoutTemplateModel,
    TenantSupplementReportModel,
    TenantSupplementStackModel,
  ] = await Promise.all([
    getTenantDailyReportModel(user.tenantDbName),
    getTenantWorkoutModel(user.tenantDbName),
    getTenantWorkoutTemplateModel(user.tenantDbName),
    getTenantSupplementReportModel(user.tenantDbName),
    getTenantSupplementStackModel(user.tenantDbName),
  ]);

  await Promise.all([
    TenantDailyReportModel.deleteMany({ userId: user.id }),
    TenantWorkoutModel.deleteMany({ userId: user.id }),
    TenantWorkoutTemplateModel.deleteMany({ userId: user.id }),
    TenantSupplementReportModel.deleteMany({ userId: user.id }),
    TenantSupplementStackModel.deleteMany({ userId: user.id }),
  ]);
}

function createRandomSeedData() {
  const firstNames = ['Alex', 'Taylor', 'Jordan', 'Sam', 'Casey'];
  const lastNames = ['Miller', 'Johnson', 'Brown', 'Andersson', 'Wilson'];
  const genders = ['female', 'male', 'other'] as const;
  const activityLevels: ActivityLevel[] = [
    'lightly_active',
    'moderately_active',
    'very_active',
    'extra_active',
  ];

  const firstName = randomPick(firstNames);
  const lastName = randomPick(lastNames);

  return {
    profile: {
      firstName,
      lastName,
      birthDate: randomBirthDate(),
      heightCm: randomInt(160, 192),
      gender: randomPick(genders),
      activityLevel: randomPick(activityLevels),
      favoriteExerciseSlugs: [],
      location: null,
    },
    settings: {
      language: cypressUser.language,
      isDarkMode: false,
      unitSystem: 'metric' as const,
      trackMenstrualCycle: true,
      trackLibido: true,
    },
    goals: {
      averageSleepHoursPerDay: randomDecimal(7, 8.5),
      regularSleepSchedule: true,
      stepsPerDay: randomInt(7000, 12000),
      waterLitersPerDay: randomDecimal(2, 3.2),
      proteinGramsPerDay: randomInt(120, 180),
      carbsGramsPerDay: randomInt(180, 320),
      fatGramsPerDay: randomInt(45, 90),
      strengthWorkoutsPerWeek: randomInt(3, 5),
      cardioMinutesPerWeek: randomInt(20, 90),
    },
  };
}

function randomBirthDate(): Date {
  const year = randomInt(1988, 2002);
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);

  return new Date(Date.UTC(year, month, day, 0, 0, 0));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}

function randomPick<T>(values: readonly T[]): T {
  return values[randomInt(0, values.length - 1)];
}

run()
  .catch((error) => {
    console.error('Failed to seed Cypress user:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongooseRootConnection();
  });
