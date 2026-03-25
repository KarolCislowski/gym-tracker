import bcrypt from 'bcryptjs';
import { createHash, randomUUID } from 'node:crypto';
import { ZodError } from 'zod';

import type {
  AuthenticatedUserSnapshot,
  AuthenticationAttemptResult,
  AuthenticatedUser,
  CredentialsInput,
  RegisterUserInput,
  ResetPasswordInput,
} from '../domain/auth.types';
import {
  loginSchema,
  passwordResetRequestSchema,
  registerSchema,
  resetPasswordSchema,
} from '../domain/auth.validation';
import {
  createCoreUserRecord,
  createTenantDatabase,
  deleteCoreUserRecordById,
  deleteTenantDatabase,
  findCoreUserByEmail,
  findCoreUserByEmailVerificationTokenHash,
  findCoreUserByPasswordResetTokenHash,
  findCoreUserForPasswordResetRequest,
  findCoreUserForVerificationResend,
  findCoreUserWithPasswordByEmail,
  findTenantHealthyHabits,
  findTenantProfileByUserId,
  findTenantSettings,
  markCoreUserEmailAsVerified,
  refreshCoreUserPasswordResetToken,
  refreshCoreUserEmailVerificationToken,
  resetCoreUserPasswordByToken,
} from '../infrastructure/auth.db';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../infrastructure/auth-email.mailer';
import { calculateAgeFromBirthDate } from '@/features/profile/application/profile-view';

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
  const verificationRequired = isEmailVerificationRequired();
  const verificationToken = verificationRequired ? randomUUID() : null;
  const emailVerificationTokenHash =
    verificationToken ? hashEmailVerificationToken(verificationToken) : null;
  const emailVerificationTokenExpiresAt = verificationToken
    ? new Date(Date.now() + 1000 * 60 * 60 * 24)
    : null;
  const createdUser = await createCoreUserRecord({
    email,
    password: hashedPassword,
    tenantDbName,
    emailVerificationTokenHash,
    emailVerificationTokenExpiresAt,
    emailVerifiedAt: verificationRequired ? null : new Date(),
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
    if (verificationToken) {
      await sendVerificationEmail({
        email,
        firstName,
        language,
        verificationUrl: buildEmailVerificationUrl(verificationToken, language),
      });
    }
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
 * Evaluates a login attempt and explains why a user cannot sign in yet.
 */
export async function authenticateUserAttempt(
  input: CredentialsInput,
): Promise<AuthenticationAttemptResult> {
  const { email, password } = loginSchema.parse(input);
  const user = await findCoreUserWithPasswordByEmail(email);

  if (!user || !user.isActive) {
    return {
      status: 'failure',
      reason: user?.isActive === false ? 'inactive_account' : 'invalid_credentials',
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      status: 'failure',
      reason: 'invalid_credentials',
    };
  }

  if (isEmailVerificationRequired() && !user.emailVerifiedAt) {
    return {
      status: 'failure',
      reason: 'email_not_verified',
    };
  }

  return {
    status: 'success',
    user: {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      tenantDbName: user.tenantDbName,
    },
  };
}

/**
 * Validates user credentials against the Core database.
 */
export async function authenticateUser(
  input: CredentialsInput,
): Promise<AuthenticatedUser | null> {
  const attempt = await authenticateUserAttempt(input);

  if (attempt.status === 'failure') {
    return null;
  }

  return attempt.user;
}

/**
 * Verifies a one-time email verification token issued at registration time.
 */
export async function verifyEmailAddress(rawToken: string): Promise<void> {
  const normalizedToken = rawToken.trim();

  if (!normalizedToken) {
    throw new Error('Verification link is invalid or has expired.');
  }

  const user = await findCoreUserByEmailVerificationTokenHash(
    hashEmailVerificationToken(normalizedToken),
  );

  if (!user) {
    throw new Error('Verification link is invalid or has expired.');
  }

  if (user.emailVerifiedAt) {
    return;
  }

  const expiresAt = user.emailVerificationTokenExpiresAt
    ? new Date(user.emailVerificationTokenExpiresAt)
    : null;

  if (!expiresAt || expiresAt.getTime() < Date.now()) {
    throw new Error('Verification link is invalid or has expired.');
  }

  await markCoreUserEmailAsVerified(user.id);
}

/**
 * Reissues a verification link for an existing unverified account.
 * The outcome is intentionally silent for missing or already verified accounts.
 */
export async function resendVerificationEmail(
  email: string,
  language: string,
): Promise<void> {
  if (!isEmailVerificationRequired()) {
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return;
  }

  const user = await findCoreUserForVerificationResend(normalizedEmail);

  if (!user || !user.isActive || user.emailVerifiedAt) {
    return;
  }

  const profile = await findTenantProfileByUserId(user.tenantDbName, user.id);
  const verificationToken = randomUUID();
  const emailVerificationTokenHash = hashEmailVerificationToken(verificationToken);
  const emailVerificationTokenExpiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24,
  );

  await refreshCoreUserEmailVerificationToken(
    user.id,
    emailVerificationTokenHash,
    emailVerificationTokenExpiresAt,
  );
  await sendVerificationEmail({
    email: user.email,
    firstName: profile?.firstName ?? fallbackFirstNameFromEmail(user.email),
    language,
    verificationUrl: buildEmailVerificationUrl(verificationToken, language),
  });
}

/**
 * Starts a password-reset flow for a verified account without disclosing account existence.
 */
export async function requestPasswordReset(
  email: string,
  language: string,
): Promise<void> {
  const { email: normalizedEmail, language: normalizedLanguage } =
    passwordResetRequestSchema.parse({
      email,
      language,
    });
  const user = await findCoreUserForPasswordResetRequest(normalizedEmail);

  if (!user || !user.isActive || !user.emailVerifiedAt) {
    return;
  }

  const profile = await findTenantProfileByUserId(user.tenantDbName, user.id);
  const resetToken = randomUUID();
  const passwordResetTokenHash = hashOneTimeToken(resetToken);
  const passwordResetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);

  await refreshCoreUserPasswordResetToken(
    user.id,
    passwordResetTokenHash,
    passwordResetTokenExpiresAt,
  );
  await sendPasswordResetEmail({
    email: user.email,
    firstName: profile?.firstName ?? fallbackFirstNameFromEmail(user.email),
    language: normalizedLanguage,
    resetUrl: buildPasswordResetUrl(resetToken, normalizedLanguage),
  });
}

/**
 * Resets a password using a one-time token delivered by email.
 */
export async function resetPasswordWithToken(
  input: ResetPasswordInput,
): Promise<void> {
  let parsedInput: ReturnType<typeof resetPasswordSchema.parse>;

  try {
    parsedInput = resetPasswordSchema.parse(input);
  } catch (error) {
    if (
      error instanceof ZodError &&
      error.issues.some((issue) => issue.message === 'PASSWORD_CONFIRMATION_MISMATCH')
    ) {
      throw new Error('PASSWORD_CONFIRMATION_MISMATCH');
    }

    throw error;
  }

  const { token, newPassword } = parsedInput;
  const user = await findCoreUserByPasswordResetTokenHash(hashOneTimeToken(token));

  if (!user) {
    throw new Error('PASSWORD_RESET_INVALID');
  }

  const expiresAt = user.passwordResetTokenExpiresAt
    ? new Date(user.passwordResetTokenExpiresAt)
    : null;

  if (!expiresAt || expiresAt.getTime() < Date.now()) {
    throw new Error('PASSWORD_RESET_INVALID');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await resetCoreUserPasswordByToken(user.id, hashedPassword);
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
          birthDate: profile.birthDate ?? null,
          age: calculateAgeFromBirthDate(profile.birthDate),
          favoriteExerciseSlugs: profile.favoriteExerciseSlugs ?? [],
          location: profile.location ?? null,
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
          trackMenstrualCycle: settings.trackMenstrualCycle,
          trackLibido: settings.trackLibido,
        }
      : null,
    healthyHabits: healthyHabits ?? {
      averageSleepHoursPerDay: null,
      stepsPerDay: null,
      waterLitersPerDay: null,
      caloriesPerDay: null,
      carbsGramsPerDay: null,
      proteinGramsPerDay: null,
      fatGramsPerDay: null,
      strengthWorkoutsPerWeek: null,
      cardioMinutesPerWeek: null,
      regularSleepSchedule: false,
    },
    favoriteExerciseSlugs: profile?.favoriteExerciseSlugs ?? [],
  };
}

function buildTenantDbName(email: string): string {
  const normalizedEmail = email.toLowerCase();
  const localPart = normalizedEmail.split('@')[0] ?? 'tenant';
  const slug = localPart.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const suffix = randomUUID().replace(/-/g, '').slice(0, 12);
  const dbName = `tenant_${slug || 'user'}_${suffix}`.slice(0, 63);

  return dbName;
}

function hashEmailVerificationToken(token: string): string {
  return hashOneTimeToken(token);
}

function buildEmailVerificationUrl(token: string, language: string): string {
  const baseUrl = resolveAppBaseUrl();
  const url = new URL('/verify-email', baseUrl);

  url.searchParams.set('token', token);
  url.searchParams.set('lang', language);

  return url.toString();
}

function buildPasswordResetUrl(token: string, language: string): string {
  const baseUrl = resolveAppBaseUrl();
  const url = new URL('/reset-password', baseUrl);

  url.searchParams.set('token', token);
  url.searchParams.set('lang', language);

  return url.toString();
}

function resolveAppBaseUrl(): string {
  const configuredBaseUrl =
    process.env.APP_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  return configuredBaseUrl ?? 'http://localhost:3000';
}

function isEmailVerificationRequired(): boolean {
  return process.env.NODE_ENV === 'production';
}

function fallbackFirstNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? 'there';
  const normalized = localPart.replace(/[._-]+/g, ' ').trim();

  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'there';
}

function hashOneTimeToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
