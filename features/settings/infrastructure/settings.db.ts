import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import { getTenantSettingsModel } from '@/infrastructure/db/models/tenant-settings.model';
import { dropTenantDatabase } from '@/infrastructure/db/tenant-database.service';
import type { TenantSettingsSnapshot } from '@/features/auth/domain/auth.types';

import type { CoreUserSecurityDto } from '../domain/settings.types';

/**
 * Finds the authenticated user record needed for password-sensitive account operations.
 * @param userId - Identifier of the Core user to load.
 * @returns A minimal Core user security DTO or `null` when the user does not exist.
 * @remarks The password hash is explicitly selected because it is hidden by default in the model.
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
 * @param tenantDbName - Name of the tenant database whose settings should be updated.
 * @param input - Partial tenant settings payload to persist.
 * @returns A promise that resolves when the tenant settings document has been updated or created.
 * @remarks The operation uses an upsert so the settings document always exists after a successful write.
 */
export async function updateTenantSettingsRecord(
  tenantDbName: string,
  input: Pick<TenantSettingsSnapshot, 'language' | 'isDarkMode' | 'unitSystem'>,
): Promise<void> {
  const TenantSettingsModel = await getTenantSettingsModel(tenantDbName);

  await TenantSettingsModel.updateOne(
    { scope: 'tenant' },
    {
      $set: {
        language: input.language,
        isDarkMode: input.isDarkMode,
        unitSystem: input.unitSystem,
      },
    },
    { upsert: true },
  );
}

/**
 * Updates the password hash for a Core user.
 * @param userId - Identifier of the Core user whose password should be updated.
 * @param password - New password hash to persist.
 * @returns A promise that resolves when the password hash has been updated.
 * @remarks The caller is responsible for hashing the password before invoking this function.
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
 * @param userId - Identifier of the Core user to delete.
 * @returns A promise that resolves when the Core user record has been removed.
 * @remarks This should be coordinated with tenant cleanup to avoid orphaned tenant databases.
 */
export async function deleteCoreUserRecord(userId: string): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndDelete(userId);
}

/**
 * Removes a tenant database after account deletion.
 * @param tenantDbName - Name of the tenant database to drop.
 * @returns A promise that resolves when the tenant database has been removed.
 * @remarks This operation is destructive and should be called only after account deletion is confirmed.
 */
export async function deleteTenantDatabaseRecord(
  tenantDbName: string,
): Promise<void> {
  await dropTenantDatabase(tenantDbName);
}
