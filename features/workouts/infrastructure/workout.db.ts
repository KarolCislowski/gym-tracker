import { getTenantWorkoutModel } from '@/infrastructure/db/models/tenant-workout.model';

import type { CreateWorkoutSessionRecordInput } from '../domain/workout.types';

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
    durationMinutes: input.durationMinutes,
    performedAt: input.performedAt,
    notes: input.notes,
    exerciseEntries: input.exerciseEntries,
  });
}
