import { getTenantProfileModel } from '@/infrastructure/db/models/tenant-profile.model';

import type { UpdateProfileInput } from '../domain/profile.types';

/**
 * Updates the authenticated user's tenant profile document.
 * @param input - Profile values to persist in the tenant profile document.
 * @returns A promise that resolves when the tenant profile document has been updated.
 * @remarks The existing profile document is assumed to exist because it is created during tenant bootstrap.
 */
export async function updateTenantProfileRecord(
  input: UpdateProfileInput,
): Promise<void> {
  const TenantProfileModel = await getTenantProfileModel(input.tenantDbName);

  await TenantProfileModel.updateOne(
    { userId: input.userId },
    {
      $set: {
        firstName: input.firstName,
        lastName: input.lastName,
        age: input.age,
        gender: input.gender,
        activityLevel: input.activityLevel,
      },
    },
  );
}
