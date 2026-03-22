import { getTenantProfileModel } from '@/infrastructure/db/models/tenant-profile.model';

/**
 * Adds an exercise slug to the authenticated user's favorites list.
 * @param input - Tenant-scoped favorite exercise identifiers.
 * @returns A promise that resolves when the tenant profile document is updated.
 */
export async function addFavoriteExerciseRecord(input: {
  tenantDbName: string;
  userId: string;
  exerciseSlug: string;
}): Promise<void> {
  const TenantProfileModel = await getTenantProfileModel(input.tenantDbName);

  await TenantProfileModel.updateOne(
    { userId: input.userId },
    {
      $addToSet: {
        favoriteExerciseSlugs: input.exerciseSlug,
      },
    },
  );
}

/**
 * Removes an exercise slug from the authenticated user's favorites list.
 * @param input - Tenant-scoped favorite exercise identifiers.
 * @returns A promise that resolves when the tenant profile document is updated.
 */
export async function removeFavoriteExerciseRecord(input: {
  tenantDbName: string;
  userId: string;
  exerciseSlug: string;
}): Promise<void> {
  const TenantProfileModel = await getTenantProfileModel(input.tenantDbName);

  await TenantProfileModel.updateOne(
    { userId: input.userId },
    {
      $pull: {
        favoriteExerciseSlugs: input.exerciseSlug,
      },
    },
  );
}
