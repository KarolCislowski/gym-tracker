import { closeMongooseRootConnection } from '@/infrastructure/db/mongoose.client';
import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import { getTenantMetadataModel } from '@/infrastructure/db/models/tenant-metadata.model';
import { getTenantProfileModel } from '@/infrastructure/db/models/tenant-profile.model';
import { getTenantSettingsModel } from '@/infrastructure/db/models/tenant-settings.model';
import { registerUser } from '@/features/auth/application/auth.service';

async function run(): Promise<void> {
  const timestamp = Date.now();
  const email = `auth-smoke-${timestamp}@gymtracker.dev`;
  const registeredUser = await registerUser({
    email,
    password: 'VeryStrong123',
    firstName: 'Test',
    lastName: 'User',
    language: 'pl',
    isDarkMode: true,
  });

  const CoreUserModel = await getCoreUserModel();
  const storedUser = await CoreUserModel.findOne({ email })
    .select('+password email isActive tenantDbName createdAt')
    .lean();
  const TenantMetadataModel = await getTenantMetadataModel(
    registeredUser.tenantDbName,
  );
  const TenantProfileModel = await getTenantProfileModel(
    registeredUser.tenantDbName,
  );
  const TenantSettingsModel = await getTenantSettingsModel(
    registeredUser.tenantDbName,
  );
  const tenantMetadata = await TenantMetadataModel.findOne({
    tenantDbName: registeredUser.tenantDbName,
  }).lean();
  const tenantProfile = await TenantProfileModel.findOne({
    userId: registeredUser.id,
  }).lean();
  const tenantSettings = await TenantSettingsModel.findOne({
    scope: 'tenant',
  }).lean();

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        userId: registeredUser.id,
        email: storedUser?.email ?? null,
        isActive: storedUser?.isActive ?? null,
        tenantDbName: storedUser?.tenantDbName ?? null,
        hasPasswordHash: Boolean(storedUser?.password),
        tenantMetadataCreated: Boolean(tenantMetadata),
        profileFirstName: tenantProfile?.firstName ?? null,
        profileLastName: tenantProfile?.lastName ?? null,
        settingsLanguage: tenantSettings?.language ?? null,
        settingsDarkMode: tenantSettings?.isDarkMode ?? null,
      },
      null,
      2,
    ),
  );
}

run()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongooseRootConnection();
  });
