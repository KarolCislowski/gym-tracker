import { z } from 'zod';

import {
  addFavoriteExerciseRecord,
  removeFavoriteExerciseRecord,
} from '../infrastructure/exercise-favorites.db';

const favoriteExerciseSchema = z.object({
  tenantDbName: z.string().trim().min(1, 'EXERCISE_FAVORITES_ERROR_GENERIC'),
  userId: z.string().trim().min(1, 'EXERCISE_FAVORITES_ERROR_GENERIC'),
  exerciseSlug: z.string().trim().min(1, 'EXERCISE_FAVORITES_ERROR_GENERIC'),
});

/**
 * Adds the selected atlas exercise to the authenticated user's favorites.
 * @param input - Tenant-scoped favorite exercise identifiers.
 * @returns A promise that resolves when the favorite is persisted.
 */
export async function addFavoriteExercise(input: {
  tenantDbName: string;
  userId: string;
  exerciseSlug: string;
}): Promise<void> {
  const parsedInput = favoriteExerciseSchema.parse(input);

  await addFavoriteExerciseRecord(parsedInput);
}

/**
 * Removes the selected atlas exercise from the authenticated user's favorites.
 * @param input - Tenant-scoped favorite exercise identifiers.
 * @returns A promise that resolves when the favorite is removed.
 */
export async function removeFavoriteExercise(input: {
  tenantDbName: string;
  userId: string;
  exerciseSlug: string;
}): Promise<void> {
  const parsedInput = favoriteExerciseSchema.parse(input);

  await removeFavoriteExerciseRecord(parsedInput);
}
