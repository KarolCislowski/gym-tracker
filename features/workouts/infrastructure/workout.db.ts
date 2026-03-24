import { getTenantWorkoutModel } from '@/infrastructure/db/models/tenant-workout.model';
import { getTenantWorkoutTemplateModel } from '@/infrastructure/db/models/tenant-workout-template.model';

import type {
  CreateWorkoutTemplateRecordInput,
  CreateWorkoutSessionRecordInput,
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
