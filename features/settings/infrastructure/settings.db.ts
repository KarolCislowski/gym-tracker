import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import { getTenantSettingsModel } from '@/infrastructure/db/models/tenant-settings.model';
import { dropTenantDatabase } from '@/infrastructure/db/tenant-database.service';
import type { TenantSettingsSnapshot } from '@/features/auth/domain/auth.types';

import type { CoreUserSecurityDto } from '../domain/settings.types';

/**
 * Finds the authenticated user record needed for password-sensitive account operations.
 */
export async function findCoreUserSecurityById(
  userId: string,
): Promise<CoreUserSecurityDto | null> {
  const CoreUserModel = await getCoreUserModel();
  const user = await CoreUserModel.findById(userId).select(
    '+password email tenantDbName',
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    password: user.password,
    tenantDbName: user.tenantDbName,
  };
}

/**
 * Updates tenant settings for the current workspace.
 */
export async function updateTenantSettingsRecord(
  tenantDbName: string,
  input: Pick<TenantSettingsSnapshot, 'language' | 'isDarkMode'>,
): Promise<void> {
  const TenantSettingsModel = await getTenantSettingsModel(tenantDbName);

  await TenantSettingsModel.updateOne(
    { scope: 'tenant' },
    {
      $set: {
        language: input.language,
        isDarkMode: input.isDarkMode,
      },
    },
    { upsert: true },
  );
}

/**
 * Updates the password hash for a Core user.
 */
export async function updateCoreUserPasswordRecord(
  userId: string,
  password: string,
): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndUpdate(userId, {
    $set: {
      password,
    },
  });
}

/**
 * Deletes a Core user record.
 */
export async function deleteCoreUserRecord(userId: string): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndDelete(userId);
}

/**
 * Removes a tenant database after account deletion.
 */
export async function deleteTenantDatabaseRecord(
  tenantDbName: string,
): Promise<void> {
  await dropTenantDatabase(tenantDbName);
}
