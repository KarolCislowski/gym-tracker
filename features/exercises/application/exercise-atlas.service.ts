import { findExerciseBySlug, findExercises } from '../infrastructure/exercise-atlas.db';
import type { Exercise, ExerciseAtlasFilters } from '../domain/exercise.types';

/**
 * Returns active atlas exercises filtered by user-facing criteria.
 * @param filters - Optional atlas filters for search, muscles, goals, and equipment.
 * @returns A promise resolving to matching active exercises sorted by name.
 */
export async function listExerciseAtlas(
  filters: ExerciseAtlasFilters = {},
): Promise<Exercise[]> {
  const exercises = await findExercises();
  const normalizedSearch = filters.search?.trim().toLowerCase();

  return exercises
    .filter((exercise) => exercise.isActive)
    .filter((exercise) =>
      filters.equipment
        ? exercise.variants.some((variant) =>
            variant.equipment.includes(filters.equipment!),
          )
        : true,
    )
    .filter((exercise) =>
      filters.goal ? exercise.goals?.includes(filters.goal) ?? false : true,
    )
    .filter((exercise) =>
      filters.muscleGroupId
        ? exercise.muscles.some(
            (muscle) => muscle.muscleGroupId === filters.muscleGroupId,
          ) ||
          exercise.variants.some((variant) =>
            variant.musclesOverride?.some(
              (muscle) => muscle.muscleGroupId === filters.muscleGroupId,
            ) ?? false,
          )
        : true,
    )
    .filter((exercise) => matchesExerciseSearch(exercise, normalizedSearch))
    .sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Returns a single active atlas exercise resolved by slug.
 * @param slug - Stable exercise slug.
 * @returns The matching exercise or `null` when it is missing or inactive.
 */
export async function getExerciseAtlasDetails(
  slug: string,
): Promise<Exercise | null> {
  const exercise = await findExerciseBySlug(slug);

  return exercise?.isActive ? exercise : null;
}

/**
 * Returns active atlas exercises that match the provided favorite slugs.
 * @param slugs - Stable exercise slugs saved in the tenant profile.
 * @returns A promise resolving to matching active exercises in the same order as the provided slugs.
 */
export async function listFavoriteExercises(slugs: string[]): Promise<Exercise[]> {
  if (!slugs.length) {
    return [];
  }

  const exercises = await findExercises();
  const activeExercisesBySlug = new Map(
    exercises
      .filter((exercise) => exercise.isActive)
      .map((exercise) => [exercise.slug, exercise] as const),
  );

  return slugs
    .map((slug) => activeExercisesBySlug.get(slug))
    .filter((exercise): exercise is Exercise => Boolean(exercise));
}

function matchesExerciseSearch(
  exercise: Exercise,
  normalizedSearch?: string,
): boolean {
  if (!normalizedSearch) {
    return true;
  }

  const searchTargets = [
    exercise.name,
    exercise.slug,
    ...(exercise.aliases ?? []),
    ...exercise.variants.map((variant) => variant.name),
    ...exercise.variants.map((variant) => variant.slug),
  ].map((value) => value.toLowerCase());

  return searchTargets.some((value) => value.includes(normalizedSearch));
}
