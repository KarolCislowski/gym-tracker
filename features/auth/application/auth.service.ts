import bcrypt from 'bcryptjs';

import type {
  AuthenticatedUserSnapshot,
  AuthenticatedUser,
  CredentialsInput,
  RegisterUserInput,
} from '../domain/auth.types';
import { loginSchema, registerSchema } from '../domain/auth.validation';
import {
  createCoreUserRecord,
  createTenantDatabase,
  deleteCoreUserRecordById,
  deleteTenantDatabase,
  findCoreUserByEmail,
  findCoreUserWithPasswordByEmail,
  findTenantHealthyHabits,
  findTenantProfileByUserId,
  findTenantSettings,
} from '../infrastructure/auth.db';

/**
 * Creates a new user in the Core database and initializes the user's tenant database.
 */
export async function registerUser(
  input: RegisterUserInput,
): Promise<AuthenticatedUser> {
  const { email, password, firstName, lastName, language, isDarkMode } =
    registerSchema.parse(input);
  const existingUser = await findCoreUserByEmail(email);

  if (existingUser) {
    throw new Error('An account with this email address already exists.');
  }

  const tenantDbName = buildTenantDbName(email);
  const hashedPassword = await bcrypt.hash(password, 12);
  const createdUser = await createCoreUserRecord({
    email,
    password: hashedPassword,
    tenantDbName,
  });

  try {
    await createTenantDatabase({
      tenantDbName,
      userId: createdUser.id,
      email,
      firstName,
      lastName,
      language,
      isDarkMode,
    });
  } catch (error) {
    await deleteCoreUserRecordById(createdUser.id);
    await deleteTenantDatabase(tenantDbName);
    throw error;
  }

  return {
    id: createdUser.id,
    email: createdUser.email,
    isActive: createdUser.isActive,
    tenantDbName: createdUser.tenantDbName,
  };
}

/**
 * Validates user credentials against the Core database.
 */
export async function authenticateUser(
  input: CredentialsInput,
): Promise<AuthenticatedUser | null> {
  const { email, password } = loginSchema.parse(input);
  const user = await findCoreUserWithPasswordByEmail(email);

  if (!user || !user.isActive) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    isActive: user.isActive,
    tenantDbName: user.tenantDbName,
  };
}

/**
 * Loads tenant-specific profile and settings for the signed-in user.
 */
export async function getAuthenticatedUserSnapshot(
  tenantDbName: string,
  userId: string,
): Promise<AuthenticatedUserSnapshot> {
  const [profile, settings, healthyHabits] = await Promise.all([
    findTenantProfileByUserId(tenantDbName, userId),
    findTenantSettings(tenantDbName),
    findTenantHealthyHabits(tenantDbName),
  ]);

  return {
    profile: profile
      ? {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          age: profile.age ?? null,
          heightCm: profile.heightCm ?? null,
          gender: profile.gender ?? null,
          activityLevel: profile.activityLevel ?? null,
        }
      : null,
    settings: settings
      ? {
          language: settings.language,
          isDarkMode: settings.isDarkMode,
          unitSystem: settings.unitSystem,
        }
      : null,
    healthyHabits: healthyHabits ?? {
      averageSleepHoursPerDay: null,
      stepsPerDay: null,
      waterLitersPerDay: null,
      proteinGramsPerDay: null,
      strengthWorkoutsPerWeek: null,
      cardioMinutesPerWeek: null,
      regularSleepSchedule: false,
    },
  };
}

function buildTenantDbName(email: string): string {
  const normalizedEmail = email.toLowerCase();
  const localPart = normalizedEmail.split('@')[0] ?? 'tenant';
  const slug = localPart.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const dbName = `tenant_${slug || 'user'}_${suffix}`.slice(0, 63);

  return dbName;
}
