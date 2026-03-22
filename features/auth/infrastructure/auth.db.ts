import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import {
  dropTenantDatabase,
  initializeTenantDatabase,
} from '@/infrastructure/db/tenant-database.service';
import type {
  CoreUserAuthDto,
  CoreUserLookupDto,
  CreateCoreUserRecordInput,
  CreateTenantDatabaseInput,
  CreatedCoreUserDto,
  TenantHealthyHabitsSnapshot,
  TenantProfileSnapshot,
  TenantSettingsSnapshot,
} from '../domain/auth.types';

/**
 * Finds a Core user by email.
 */
export async function findCoreUserByEmail(
  email: string,
): Promise<CoreUserLookupDto | null> {
  const CoreUserModel = await getCoreUserModel();
  const user = await CoreUserModel.findOne({ email }).lean();

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
  };
}

/**
 * Finds a Core user by email and explicitly includes the password hash.
 */
export async function findCoreUserWithPasswordByEmail(
  email: string,
): Promise<CoreUserAuthDto | null> {
  const CoreUserModel = await getCoreUserModel();
  const user = await CoreUserModel.findOne({ email }).select(
    '+password isActive tenantDbName email',
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    password: user.password,
    isActive: user.isActive,
    tenantDbName: user.tenantDbName,
  };
}

/**
 * Creates a user record in the shared Core database.
 */
export async function createCoreUserRecord(
  input: CreateCoreUserRecordInput,
): Promise<CreatedCoreUserDto> {
  const CoreUserModel = await getCoreUserModel();

  const createdUser = await CoreUserModel.create({
    email: input.email,
    password: input.password,
    isActive: true,
    tenantDbName: input.tenantDbName,
  });

  return {
    id: createdUser.id,
    email: createdUser.email,
    isActive: createdUser.isActive,
    tenantDbName: createdUser.tenantDbName,
  };
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
): Promise<TenantProfileSnapshot | null> {
  const { getTenantProfileModel } = await import(
    '@/infrastructure/db/models/tenant-profile.model'
  );
  const TenantProfileModel = await getTenantProfileModel(tenantDbName);
  const profile = await TenantProfileModel.findOne({ userId }).lean();

  if (!profile) {
    return null;
  }

  return {
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    birthDate:
      profile.birthDate instanceof Date
        ? profile.birthDate.toISOString()
        : null,
    age: null,
    favoriteExerciseSlugs: profile.favoriteExerciseSlugs ?? [],
    heightCm: profile.heightCm ?? null,
    gender: profile.gender ?? null,
    activityLevel: profile.activityLevel ?? null,
  };
}

/**
 * Finds tenant-level settings for the current tenant database.
 */
export async function findTenantSettings(
  tenantDbName: string,
): Promise<TenantSettingsSnapshot | null> {
  const { getTenantSettingsModel } = await import(
    '@/infrastructure/db/models/tenant-settings.model'
  );
  const TenantSettingsModel = await getTenantSettingsModel(tenantDbName);
  const settings = await TenantSettingsModel.findOne({ scope: 'tenant' }).lean();

  if (!settings) {
    return null;
  }

  return {
    language: settings.language,
    isDarkMode: settings.isDarkMode,
    unitSystem: settings.unitSystem ?? 'metric',
  };
}

/**
 * Finds tenant-level healthy habits goals for the current tenant database.
 * @param tenantDbName - Name of the tenant database.
 * @returns The tenant healthy habits snapshot or `null` when it does not exist.
 */
export async function findTenantHealthyHabits(
  tenantDbName: string,
): Promise<TenantHealthyHabitsSnapshot | null> {
  const { getTenantHealthyHabitsModel } = await import(
    '@/infrastructure/db/models/tenant-healthy-habits.model'
  );
  const TenantHealthyHabitsModel = await getTenantHealthyHabitsModel(tenantDbName);
  const habits = await TenantHealthyHabitsModel.findOne({ scope: 'tenant' }).lean();

  if (!habits) {
    return null;
  }

  return {
    averageSleepHoursPerDay: habits.averageSleepHoursPerDay ?? null,
    stepsPerDay: habits.stepsPerDay ?? null,
    waterLitersPerDay: habits.waterLitersPerDay ?? null,
    proteinGramsPerDay: habits.proteinGramsPerDay ?? null,
    strengthWorkoutsPerWeek: habits.strengthWorkoutsPerWeek ?? null,
    cardioMinutesPerWeek: habits.cardioMinutesPerWeek ?? null,
    regularSleepSchedule: habits.regularSleepSchedule ?? false,
  };
}
