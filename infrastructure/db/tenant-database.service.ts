import { getTenantMetadataModel } from './models/tenant-metadata.model';
import { getTenantProfileModel } from './models/tenant-profile.model';
import { getTenantSettingsModel } from './models/tenant-settings.model';
import { getTenantDbConnection } from './mongoose.client';

interface InitializeTenantDatabaseInput {
  tenantDbName: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  isDarkMode: boolean;
}

/**
 * Creates the tenant database by writing an initialization document.
 * In MongoDB, a database becomes visible after its first write.
 */
export async function initializeTenantDatabase(
  input: InitializeTenantDatabaseInput,
): Promise<void> {
  const TenantMetadataModel = await getTenantMetadataModel(input.tenantDbName);
  const TenantProfileModel = await getTenantProfileModel(input.tenantDbName);
  const TenantSettingsModel = await getTenantSettingsModel(input.tenantDbName);

  await TenantMetadataModel.updateOne(
    { tenantDbName: input.tenantDbName },
    { $setOnInsert: { tenantDbName: input.tenantDbName } },
    { upsert: true },
  );

  await TenantProfileModel.updateOne(
    { userId: input.userId },
    {
      $setOnInsert: {
        userId: input.userId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    },
    { upsert: true },
  );

  await TenantSettingsModel.updateOne(
    { scope: 'tenant' },
    {
      $setOnInsert: {
        scope: 'tenant',
        language: input.language,
        isDarkMode: input.isDarkMode,
        unitSystem: 'metric',
      },
    },
    { upsert: true },
  );
}

/**
 * Drops a tenant database, for example to roll back a failed registration.
 */
export async function dropTenantDatabase(tenantDbName: string): Promise<void> {
  const connection = await getTenantDbConnection(tenantDbName);

  await connection.dropDatabase();
}
