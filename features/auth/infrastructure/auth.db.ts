import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import {
  dropTenantDatabase,
  initializeTenantDatabase,
} from '@/infrastructure/db/tenant-database.service';
import type {
  CoreUserEmailVerificationLookupDto,
  CoreUserAuthDto,
  CoreUserLookupDto,
  CoreUserPasswordResetLookupDto,
  CoreUserPasswordResetRequestDto,
  CoreUserVerificationResendDto,
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
 * Finds the Core user data required to resend a verification link.
 */
export async function findCoreUserForVerificationResend(
  email: string,
): Promise<CoreUserVerificationResendDto | null> {
  const CoreUserModel = await getCoreUserModel();
  const user = await CoreUserModel.findOne({ email }).lean();

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    isActive: user.isActive,
    tenantDbName: user.tenantDbName,
    emailVerifiedAt:
      user.emailVerifiedAt instanceof Date
        ? user.emailVerifiedAt.toISOString()
        : null,
  };
}

/**
 * Finds the Core user data required to issue a password-reset email.
 */
export async function findCoreUserForPasswordResetRequest(
  email: string,
): Promise<CoreUserPasswordResetRequestDto | null> {
  const CoreUserModel = await getCoreUserModel();
  const user = await CoreUserModel.findOne({ email }).lean();

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    email: user.email,
    isActive: user.isActive,
    tenantDbName: user.tenantDbName,
    emailVerifiedAt:
      user.emailVerifiedAt instanceof Date
        ? user.emailVerifiedAt.toISOString()
        : null,
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
    emailVerifiedAt:
      user.emailVerifiedAt instanceof Date
        ? user.emailVerifiedAt.toISOString()
        : null,
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
    emailVerifiedAt: input.emailVerifiedAt ?? null,
    emailVerificationTokenHash: input.emailVerificationTokenHash ?? null,
    emailVerificationTokenExpiresAt: input.emailVerificationTokenExpiresAt ?? null,
  });

  return {
    id: createdUser.id,
    email: createdUser.email,
    isActive: createdUser.isActive,
    tenantDbName: createdUser.tenantDbName,
    emailVerifiedAt:
      createdUser.emailVerifiedAt instanceof Date
        ? createdUser.emailVerifiedAt.toISOString()
        : null,
  };
}

/**
 * Finds a Core user by a hashed email-verification token.
 */
export async function findCoreUserByEmailVerificationTokenHash(
  emailVerificationTokenHash: string,
): Promise<CoreUserEmailVerificationLookupDto | null> {
  const CoreUserModel = await getCoreUserModel();
  const user = await CoreUserModel.findOne({
    emailVerificationTokenHash,
  }).select('+emailVerificationTokenHash +emailVerificationTokenExpiresAt');

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    emailVerifiedAt:
      user.emailVerifiedAt instanceof Date
        ? user.emailVerifiedAt.toISOString()
        : null,
    emailVerificationTokenExpiresAt:
      user.emailVerificationTokenExpiresAt instanceof Date
        ? user.emailVerificationTokenExpiresAt.toISOString()
        : null,
  };
}

/**
 * Marks a Core user email as verified and clears one-time verification token fields.
 */
export async function markCoreUserEmailAsVerified(userId: string): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndUpdate(userId, {
    $set: {
      emailVerifiedAt: new Date(),
    },
    $unset: {
      emailVerificationTokenHash: 1,
      emailVerificationTokenExpiresAt: 1,
    },
  });
}

/**
 * Replaces the one-time verification token for a Core user.
 */
export async function refreshCoreUserEmailVerificationToken(
  userId: string,
  emailVerificationTokenHash: string,
  emailVerificationTokenExpiresAt: Date,
): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndUpdate(userId, {
    $set: {
      emailVerificationTokenHash,
      emailVerificationTokenExpiresAt,
    },
  });
}

/**
 * Stores a fresh one-time password-reset token for a Core user.
 */
export async function refreshCoreUserPasswordResetToken(
  userId: string,
  passwordResetTokenHash: string,
  passwordResetTokenExpiresAt: Date,
): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndUpdate(userId, {
    $set: {
      passwordResetTokenHash,
      passwordResetTokenExpiresAt,
    },
  });
}

/**
 * Finds a Core user by a hashed password-reset token.
 */
export async function findCoreUserByPasswordResetTokenHash(
  passwordResetTokenHash: string,
): Promise<CoreUserPasswordResetLookupDto | null> {
  const CoreUserModel = await getCoreUserModel();
  const user = await CoreUserModel.findOne({
    passwordResetTokenHash,
  }).select('+passwordResetTokenHash +passwordResetTokenExpiresAt');

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    passwordResetTokenExpiresAt:
      user.passwordResetTokenExpiresAt instanceof Date
        ? user.passwordResetTokenExpiresAt.toISOString()
        : null,
  };
}

/**
 * Updates a user's password and clears any outstanding password-reset token.
 */
export async function resetCoreUserPasswordByToken(
  userId: string,
  password: string,
): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  await CoreUserModel.findByIdAndUpdate(userId, {
    $set: {
      password,
    },
    $unset: {
      passwordResetTokenHash: 1,
      passwordResetTokenExpiresAt: 1,
    },
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
    location: profile.location
      ? {
          provider: profile.location.provider,
          placeId: profile.location.placeId,
          displayName: profile.location.displayName,
          formattedAddress: profile.location.formattedAddress,
          latitude: profile.location.latitude,
          longitude: profile.location.longitude,
          countryCode: profile.location.countryCode ?? null,
          country: profile.location.country ?? null,
          region: profile.location.region ?? null,
          city: profile.location.city ?? null,
          locality: profile.location.locality ?? null,
          postalCode: profile.location.postalCode ?? null,
        }
      : null,
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
    trackMenstrualCycle: settings.trackMenstrualCycle ?? false,
    trackLibido: settings.trackLibido ?? false,
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
    caloriesPerDay: habits.caloriesPerDay ?? null,
    carbsGramsPerDay: habits.carbsGramsPerDay ?? null,
    proteinGramsPerDay: habits.proteinGramsPerDay ?? null,
    fatGramsPerDay: habits.fatGramsPerDay ?? null,
    strengthWorkoutsPerWeek: habits.strengthWorkoutsPerWeek ?? null,
    cardioMinutesPerWeek: habits.cardioMinutesPerWeek ?? null,
    regularSleepSchedule: habits.regularSleepSchedule ?? false,
  };
}
