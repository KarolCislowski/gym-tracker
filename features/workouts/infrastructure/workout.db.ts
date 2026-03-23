import { getTenantWorkoutModel } from '@/infrastructure/db/models/tenant-workout.model';

import type {
  CreateWorkoutSessionRecordInput,
  WorkoutSessionSummary,
} from '../domain/workout.types';

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
  }));
}
