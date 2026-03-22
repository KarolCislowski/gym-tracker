import { createWorkoutSessionSchema } from '../domain/workout.validation';
import type { CreateWorkoutSessionInput } from '../domain/workout.types';
import { createTenantWorkoutSessionRecord } from '../infrastructure/workout.db';

/**
 * Persists a workout session with the performed exercise entries and sets.
 * @param input - Tenant-scoped workout session submitted by the user.
 * @returns A promise that resolves when the workout session has been stored.
 */
export async function createWorkoutSession(
  input: CreateWorkoutSessionInput,
): Promise<void> {
  createWorkoutSessionSchema.parse(input);

  await createTenantWorkoutSessionRecord(input);
}
