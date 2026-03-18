import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import {
  dropTenantDatabase,
  initializeTenantDatabase,
} from '@/infrastructure/db/tenant-database.service';

interface CreateCoreUserRecordInput {
  email: string;
  password: string;
  tenantDbName: string;
}

interface CreateTenantDatabaseInput {
  tenantDbName: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  isDarkMode: boolean;
}

/**
 * Finds a Core user by email.
 */
export async function findCoreUserByEmail(email: string) {
  const CoreUserModel = await getCoreUserModel();

  return CoreUserModel.findOne({ email });
}

/**
 * Finds a Core user by email and explicitly includes the password hash.
 */
export async function findCoreUserWithPasswordByEmail(email: string) {
  const CoreUserModel = await getCoreUserModel();

  return CoreUserModel.findOne({ email }).select(
    '+password isActive tenantDbName email',
  );
}

/**
 * Creates a user record in the shared Core database.
 */
export async function createCoreUserRecord(
  input: CreateCoreUserRecordInput,
) {
  const CoreUserModel = await getCoreUserModel();

  return CoreUserModel.create({
    email: input.email,
    password: input.password,
    isActive: true,
    tenantDbName: input.tenantDbName,
  });
}

/**
 * Deletes a Core user by id.
 */
export async function deleteCoreUserRecordById(userId: string): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndDelete(userId);
}

/**
 * Creates the tenant database and its bootstrap metadata.
 */
export async function createTenantDatabase(
  input: CreateTenantDatabaseInput,
): Promise<void> {
  await initializeTenantDatabase(input);
}

/**
 * Drops a tenant database, typically to roll back a failed registration.
 */
export async function deleteTenantDatabase(tenantDbName: string): Promise<void> {
  await dropTenantDatabase(tenantDbName);
}

/**
 * Finds a tenant profile for the signed-in user.
 */
export async function findTenantProfileByUserId(
  tenantDbName: string,
  userId: string,
) {
  const { getTenantProfileModel } = await import(
    '@/infrastructure/db/models/tenant-profile.model'
  );
  const TenantProfileModel = await getTenantProfileModel(tenantDbName);

  return TenantProfileModel.findOne({ userId }).lean();
}

/**
 * Finds tenant-level settings for the current tenant database.
 */
export async function findTenantSettings(tenantDbName: string) {
  const { getTenantSettingsModel } = await import(
    '@/infrastructure/db/models/tenant-settings.model'
  );
  const TenantSettingsModel = await getTenantSettingsModel(tenantDbName);

  return TenantSettingsModel.findOne({ scope: 'tenant' }).lean();
}
