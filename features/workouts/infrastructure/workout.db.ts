import { getTenantWorkoutModel } from '@/infrastructure/db/models/tenant-workout.model';
import { getTenantWorkoutTemplateModel } from '@/infrastructure/db/models/tenant-workout-template.model';

import type {
  CreateWorkoutTemplateRecordInput,
  CreateWorkoutSessionRecordInput,
  UpdateWorkoutTemplateInput,
  UpdateWorkoutSessionInput,
  WorkoutBlockInput,
  WorkoutSessionDetails,
  WorkoutTemplateSummary,
  WorkoutSessionAnalytics,
  WorkoutSessionSummary,
} from '../domain/workout.types';
import type {
  AttachmentType,
  GripType,
  StanceType,
} from '@/features/exercises/domain/exercise.types';

/**
 * Creates a tenant workout session record containing exercise entries and sets.
 * @param input - Validated workout session values to persist.
 * @returns A promise that resolves when the workout session document has been created.
 */
export async function createTenantWorkoutSessionRecord(
  input: CreateWorkoutSessionRecordInput & { tenantDbName: string },
): Promise<void> {
  const TenantWorkoutModel = await getTenantWorkoutModel(input.tenantDbName);

  await TenantWorkoutModel.create({
    userId: input.userId,
    workoutName: input.workoutName,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    durationMinutes: input.durationMinutes,
    performedAt: input.performedAt,
    notes: input.notes,
    locationSnapshot: input.locationSnapshot,
    weatherSnapshot: input.weatherSnapshot,
    blocks: input.blocks,
  });
}

/**
 * Creates a tenant workout template record containing predefined blocks and exercises.
 * @param input - Validated workout template values to persist.
 * @returns A promise that resolves when the workout template document has been created.
 */
export async function createTenantWorkoutTemplateRecord(
  input: CreateWorkoutTemplateRecordInput & { tenantDbName: string },
): Promise<void> {
  const TenantWorkoutTemplateModel = await getTenantWorkoutTemplateModel(
    input.tenantDbName,
  );

  await TenantWorkoutTemplateModel.create({
    userId: input.userId,
    name: input.name,
    notes: input.notes,
    blocks: input.blocks,
  });
}

/**
 * Lists workout session summaries for a tenant-scoped user in reverse chronological order.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to lightweight workout session summaries.
 */
export async function listTenantWorkoutSessionRecords(
  tenantDbName: string,
  userId: string,
): Promise<WorkoutSessionSummary[]> {
  const TenantWorkoutModel = await getTenantWorkoutModel(tenantDbName);
  const sessions = await TenantWorkoutModel.find({ userId })
    .sort({ performedAt: -1 })
    .lean();

  return sessions.map((session) => ({
    id: session._id.toString(),
    workoutName: session.workoutName,
    performedAt: session.performedAt.toISOString(),
    durationMinutes: session.durationMinutes ?? null,
    notes: session.notes ?? null,
    blockCount: session.blocks?.length ?? 0,
    exerciseCount:
      session.blocks?.reduce(
        (total, block) => total + (block.entries?.length ?? 0),
        0,
      ) ?? 0,
    setCount:
      session.blocks?.reduce(
        (total, block) =>
          total +
          (block.entries?.reduce(
            (entryTotal, entry) => entryTotal + (entry.sets?.length ?? 0),
            0,
          ) ?? 0),
        0,
      ) ?? 0,
  }));
}

/**
 * Lists workout templates for a tenant-scoped user in alphabetical order.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to workout templates ready for prefill usage in the report form.
 */
export async function listTenantWorkoutTemplateRecords(
  tenantDbName: string,
  userId: string,
): Promise<WorkoutTemplateSummary[]> {
  const TenantWorkoutTemplateModel = await getTenantWorkoutTemplateModel(
    tenantDbName,
  );
  const templates = await TenantWorkoutTemplateModel.find({ userId })
    .sort({ name: 1, createdAt: -1 })
    .lean();

  return templates.map((template) => ({
    id: template._id.toString(),
    name: template.name,
    notes: template.notes ?? null,
    blockCount: template.blocks?.length ?? 0,
    exerciseCount:
      template.blocks?.reduce(
        (total, block) => total + (block.entries?.length ?? 0),
        0,
      ) ?? 0,
    blocks:
      template.blocks?.map((block) => ({
        order: block.order,
        type: block.type,
        name: block.name ?? null,
        rounds: block.rounds ?? null,
        restAfterBlockSec: block.restAfterBlockSec ?? null,
        entries:
          block.entries?.map((entry) => ({
            order: entry.order,
            exerciseId: entry.exerciseId,
            exerciseSlug: entry.exerciseSlug,
            variantId: entry.variantId ?? null,
            selectedGrip: (entry.selectedGrip as GripType | null) ?? null,
            selectedStance: (entry.selectedStance as StanceType | null) ?? null,
            selectedAttachment:
              (entry.selectedAttachment as AttachmentType | null) ?? null,
            notes: entry.notes ?? null,
            restAfterEntrySec: entry.restAfterEntrySec ?? null,
          })) ?? [],
      })) ?? [],
  }));
}

export async function findTenantWorkoutTemplateRecordById(
  tenantDbName: string,
  userId: string,
  templateId: string,
): Promise<WorkoutTemplateSummary | null> {
  const TenantWorkoutTemplateModel = await getTenantWorkoutTemplateModel(
    tenantDbName,
  );
  const template = await TenantWorkoutTemplateModel.findOne({
    _id: templateId,
    userId,
  }).lean();

  if (!template) {
    return null;
  }

  return {
    id: template._id.toString(),
    name: template.name,
    notes: template.notes ?? null,
    blockCount: template.blocks?.length ?? 0,
    exerciseCount:
      template.blocks?.reduce(
        (total, block) => total + (block.entries?.length ?? 0),
        0,
      ) ?? 0,
    blocks:
      template.blocks?.map((block) => ({
        order: block.order,
        type: block.type,
        name: block.name ?? null,
        rounds: block.rounds ?? null,
        restAfterBlockSec: block.restAfterBlockSec ?? null,
        entries:
          block.entries?.map((entry) => ({
            order: entry.order,
            exerciseId: entry.exerciseId,
            exerciseSlug: entry.exerciseSlug,
            variantId: entry.variantId ?? null,
            selectedGrip: (entry.selectedGrip as GripType | null) ?? null,
            selectedStance: (entry.selectedStance as StanceType | null) ?? null,
            selectedAttachment:
              (entry.selectedAttachment as AttachmentType | null) ?? null,
            notes: entry.notes ?? null,
            restAfterEntrySec: entry.restAfterEntrySec ?? null,
          })) ?? [],
      })) ?? [],
  };
}

export async function updateTenantWorkoutTemplateRecord(
  input: UpdateWorkoutTemplateInput,
): Promise<void> {
  const TenantWorkoutTemplateModel = await getTenantWorkoutTemplateModel(
    input.tenantDbName,
  );

  const result = await TenantWorkoutTemplateModel.updateOne(
    { _id: input.templateId, userId: input.userId },
    {
      $set: {
        name: input.name,
        notes: input.notes,
        blocks: input.blocks,
      },
    },
  );

  if (!result.matchedCount) {
    throw new Error('WORKOUT_TEMPLATE_NOT_FOUND');
  }
}

export async function deleteTenantWorkoutTemplateRecord(
  tenantDbName: string,
  userId: string,
  templateId: string,
): Promise<void> {
  const TenantWorkoutTemplateModel = await getTenantWorkoutTemplateModel(
    tenantDbName,
  );
  const result = await TenantWorkoutTemplateModel.deleteOne({
    _id: templateId,
    userId,
  });

  if (!result.deletedCount) {
    throw new Error('WORKOUT_TEMPLATE_NOT_FOUND');
  }
}

/**
 * Lists tenant workout sessions with entry-level set counts for analytics purposes.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to workout sessions normalized for dashboard analytics.
 */
export async function listTenantWorkoutSessionAnalyticsRecords(
  tenantDbName: string,
  userId: string,
): Promise<WorkoutSessionAnalytics[]> {
  const TenantWorkoutModel = await getTenantWorkoutModel(tenantDbName);
  const sessions = await TenantWorkoutModel.find({ userId })
    .sort({ performedAt: -1 })
    .lean();

  return sessions.map((session) => ({
    id: session._id.toString(),
    performedAt: session.performedAt.toISOString(),
    entries:
      session.blocks?.flatMap((block) =>
        block.entries?.map((entry) => ({
          exerciseSlug: entry.exerciseSlug,
          variantId: entry.variantId ?? null,
          setCount: entry.sets?.length ?? 0,
        })) ?? [],
      ) ?? [],
  }));
}

export async function findTenantWorkoutSessionRecordById(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<WorkoutSessionDetails | null> {
  const TenantWorkoutModel = await getTenantWorkoutModel(tenantDbName);
  const session = await TenantWorkoutModel.findOne({ _id: reportId, userId }).lean();

  if (!session) {
    return null;
  }

  return {
    id: session._id.toString(),
    workoutName: session.workoutName,
    startedAt: session.startedAt ? session.startedAt.toISOString() : null,
    endedAt: session.endedAt ? session.endedAt.toISOString() : null,
    durationMinutes: session.durationMinutes ?? null,
    performedAt: session.performedAt.toISOString(),
    notes: session.notes ?? null,
    locationSnapshot: session.locationSnapshot
      ? {
          provider: 'google_places',
          placeId: session.locationSnapshot.placeId,
          displayName: session.locationSnapshot.displayName,
          formattedAddress: session.locationSnapshot.formattedAddress,
          latitude: session.locationSnapshot.latitude,
          longitude: session.locationSnapshot.longitude,
          countryCode: session.locationSnapshot.countryCode ?? null,
          country: session.locationSnapshot.country ?? null,
          region: session.locationSnapshot.region ?? null,
          city: session.locationSnapshot.city ?? null,
          locality: session.locationSnapshot.locality ?? null,
          postalCode: session.locationSnapshot.postalCode ?? null,
        }
      : null,
    weatherSnapshot: session.weatherSnapshot
      ? {
          provider: session.weatherSnapshot.provider,
          temperatureC: session.weatherSnapshot.temperatureC ?? null,
          apparentTemperatureC:
            session.weatherSnapshot.apparentTemperatureC ?? null,
          humidityPercent: session.weatherSnapshot.humidityPercent ?? null,
          windSpeedKph: session.weatherSnapshot.windSpeedKph ?? null,
          precipitationMm: session.weatherSnapshot.precipitationMm ?? null,
          weatherCode: session.weatherSnapshot.weatherCode ?? null,
          capturedAt: session.weatherSnapshot.capturedAt,
        }
      : null,
    blocks: mapWorkoutBlocks(
      (session.blocks as WorkoutBlockInput[] | undefined) ?? [],
    ),
  };
}

export async function updateTenantWorkoutSessionRecord(
  input: UpdateWorkoutSessionInput,
): Promise<void> {
  const TenantWorkoutModel = await getTenantWorkoutModel(input.tenantDbName);

  await TenantWorkoutModel.updateOne(
    { _id: input.reportId, userId: input.userId },
    {
      $set: {
        workoutName: input.workoutName,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
        durationMinutes: input.durationMinutes,
        performedAt: input.performedAt,
        notes: input.notes,
        locationSnapshot: input.locationSnapshot,
        weatherSnapshot: input.weatherSnapshot,
        blocks: input.blocks,
      },
    },
  );
}

function mapWorkoutBlocks(blocks: WorkoutBlockInput[]): WorkoutBlockInput[] {
  return blocks.map((block) => ({
    order: block.order,
    type: block.type,
    name: block.name ?? null,
    rounds: block.rounds ?? null,
    restAfterBlockSec: block.restAfterBlockSec ?? null,
    entries: (block.entries ?? []).map((entry) => ({
      order: entry.order,
      exerciseId: entry.exerciseId,
      exerciseSlug: entry.exerciseSlug,
      variantId: entry.variantId ?? null,
      trackableMetrics: entry.trackableMetrics ?? [],
      selectedEquipment: entry.selectedEquipment ?? [],
      selectedGrip: (entry.selectedGrip as GripType | null) ?? null,
      selectedStance: (entry.selectedStance as StanceType | null) ?? null,
      selectedAttachment: (entry.selectedAttachment as AttachmentType | null) ?? null,
      notes: entry.notes ?? null,
      restAfterEntrySec: entry.restAfterEntrySec ?? null,
      sets: (entry.sets ?? []).map((set) => ({
        order: set.order,
        reps: set.reps ?? null,
        weight: set.weight ?? null,
        durationSec: set.durationSec ?? null,
        distanceMeters: set.distanceMeters ?? null,
        calories: set.calories ?? null,
        rpe: set.rpe ?? null,
        rir: set.rir ?? null,
        isWarmup: set.isWarmup,
        isFailure: set.isFailure,
        setKind: set.setKind,
        parentSetOrder: set.parentSetOrder ?? null,
        completedAt: set.completedAt ?? null,
      })),
    })),
  }));
}
