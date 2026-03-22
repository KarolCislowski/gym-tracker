'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import {
  addFavoriteExercise,
  removeFavoriteExercise,
} from '../application/exercise-favorites.service';

/**
 * Toggles the authenticated user's favorite state for a single exercise.
 * @param input - Stable exercise identifier and current favorite state.
 * @returns A promise that resolves when affected routes have been revalidated.
 */
export async function toggleFavoriteExerciseAction(input: {
  exerciseSlug: string;
  isFavorite: boolean;
}): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  if (input.isFavorite) {
    await removeFavoriteExercise({
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      exerciseSlug: input.exerciseSlug,
    });
  } else {
    await addFavoriteExercise({
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      exerciseSlug: input.exerciseSlug,
    });
  }

  revalidatePath('/exercises');
  revalidatePath(`/exercises/${input.exerciseSlug}`);
}
