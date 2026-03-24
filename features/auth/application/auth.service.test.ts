import bcrypt from 'bcryptjs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type {
  CoreUserEmailVerificationLookupDto,
  CoreUserAuthDto,
  CoreUserLookupDto,
  CoreUserPasswordResetLookupDto,
  CoreUserPasswordResetRequestDto,
  CoreUserVerificationResendDto,
  CreatedCoreUserDto,
  TenantHealthyHabitsSnapshot,
  TenantProfileSnapshot,
  TenantSettingsSnapshot,
} from '../domain/auth.types';

import {
  authenticateUser,
  authenticateUserAttempt,
  getAuthenticatedUserSnapshot,
  requestPasswordReset,
  registerUser,
  resetPasswordWithToken,
  resendVerificationEmail,
  verifyEmailAddress,
} from './auth.service';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('../infrastructure/auth.db', () => ({
  createCoreUserRecord: vi.fn(),
  createTenantDatabase: vi.fn(),
  deleteCoreUserRecordById: vi.fn(),
  deleteTenantDatabase: vi.fn(),
  findCoreUserByEmail: vi.fn(),
  findCoreUserByEmailVerificationTokenHash: vi.fn(),
  findCoreUserByPasswordResetTokenHash: vi.fn(),
  findCoreUserForPasswordResetRequest: vi.fn(),
  findCoreUserForVerificationResend: vi.fn(),
  findCoreUserWithPasswordByEmail: vi.fn(),
  findTenantHealthyHabits: vi.fn(),
  findTenantProfileByUserId: vi.fn(),
  findTenantSettings: vi.fn(),
  markCoreUserEmailAsVerified: vi.fn(),
  refreshCoreUserPasswordResetToken: vi.fn(),
  refreshCoreUserEmailVerificationToken: vi.fn(),
  resetCoreUserPasswordByToken: vi.fn(),
}));

vi.mock('../infrastructure/auth-email.mailer', () => ({
  sendPasswordResetEmail: vi.fn(),
  sendVerificationEmail: vi.fn(),
}));

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

const mockedBcrypt = vi.mocked(bcrypt);
const mockedCreateCoreUserRecord = vi.mocked(createCoreUserRecord);
const mockedCreateTenantDatabase = vi.mocked(createTenantDatabase);
const mockedDeleteCoreUserRecordById = vi.mocked(deleteCoreUserRecordById);
const mockedDeleteTenantDatabase = vi.mocked(deleteTenantDatabase);
const mockedFindCoreUserByEmail = vi.mocked(findCoreUserByEmail);
const mockedFindCoreUserByEmailVerificationTokenHash = vi.mocked(
  findCoreUserByEmailVerificationTokenHash,
);
const mockedFindCoreUserByPasswordResetTokenHash = vi.mocked(
  findCoreUserByPasswordResetTokenHash,
);
const mockedFindCoreUserForPasswordResetRequest = vi.mocked(
  findCoreUserForPasswordResetRequest,
);
const mockedFindCoreUserForVerificationResend = vi.mocked(
  findCoreUserForVerificationResend,
);
const mockedFindCoreUserWithPasswordByEmail = vi.mocked(
  findCoreUserWithPasswordByEmail,
);
const mockedFindTenantHealthyHabits = vi.mocked(findTenantHealthyHabits);
const mockedFindTenantProfileByUserId = vi.mocked(findTenantProfileByUserId);
const mockedFindTenantSettings = vi.mocked(findTenantSettings);
const mockedMarkCoreUserEmailAsVerified = vi.mocked(markCoreUserEmailAsVerified);
const mockedRefreshCoreUserPasswordResetToken = vi.mocked(
  refreshCoreUserPasswordResetToken,
);
const mockedRefreshCoreUserEmailVerificationToken = vi.mocked(
  refreshCoreUserEmailVerificationToken,
);
const mockedResetCoreUserPasswordByToken = vi.mocked(resetCoreUserPasswordByToken);
const mockedSendPasswordResetEmail = vi.mocked(sendPasswordResetEmail);
const mockedSendVerificationEmail = vi.mocked(sendVerificationEmail);
const mockedHash = mockedBcrypt.hash as unknown as ReturnType<typeof vi.fn>;
const mockedCompare = mockedBcrypt.compare as unknown as ReturnType<typeof vi.fn>;

describe('auth.service', () => {
  /**
   * Resets mock state before each scenario so assertions stay isolated.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'production');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  /**
   * Verifies that registration hashes the password, creates the Core user,
   * and initializes the tenant database with the provided preferences.
   */
  test('registerUser creates a core user and tenant database', async () => {
    mockedFindCoreUserByEmail.mockResolvedValueOnce(null);
    mockedHash.mockResolvedValueOnce('hashed-password');
    mockedCreateCoreUserRecord.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: null,
    } satisfies CreatedCoreUserDto);

    const result = await registerUser({
      email: 'john@example.com',
      password: 'VeryStrong123',
      firstName: 'John',
      lastName: 'Doe',
      language: 'sv',
      isDarkMode: true,
    });

    expect(mockedBcrypt.hash).toHaveBeenCalledWith('VeryStrong123', 12);
    expect(mockedCreateCoreUserRecord).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'hashed-password',
      tenantDbName: expect.stringMatching(/^tenant_john_/),
      emailVerificationTokenHash: expect.any(String),
      emailVerificationTokenExpiresAt: expect.any(Date),
      emailVerifiedAt: null,
    });
    expect(mockedCreateTenantDatabase).toHaveBeenCalledWith({
      tenantDbName: expect.stringMatching(/^tenant_john_/),
      userId: 'user-1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      language: 'sv',
      isDarkMode: true,
    });
    expect(mockedSendVerificationEmail).toHaveBeenCalledWith({
      email: 'john@example.com',
      firstName: 'John',
      language: 'sv',
      verificationUrl: expect.stringContaining('/verify-email?'),
    });
    expect(result).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
    });
  });

  /**
   * Verifies that non-production registrations are auto-verified and skip verification email delivery.
   */
  test('registerUser auto-verifies accounts outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    mockedFindCoreUserByEmail.mockResolvedValueOnce(null);
    mockedHash.mockResolvedValueOnce('hashed-password');
    mockedCreateCoreUserRecord.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: '2026-03-24T12:00:00.000Z',
    } satisfies CreatedCoreUserDto);

    await registerUser({
      email: 'john@example.com',
      password: 'VeryStrong123',
      firstName: 'John',
      lastName: 'Doe',
      language: 'sv',
      isDarkMode: true,
    });

    expect(mockedCreateCoreUserRecord).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'hashed-password',
      tenantDbName: expect.stringMatching(/^tenant_john_/),
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      emailVerifiedAt: expect.any(Date),
    });
    expect(mockedSendVerificationEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies that registration stops early when the email already exists.
   */
  test('registerUser rejects duplicate emails', async () => {
    mockedFindCoreUserByEmail.mockResolvedValueOnce({
      id: 'existing-user',
    } satisfies CoreUserLookupDto);

    await expect(
      registerUser({
        email: 'john@example.com',
        password: 'VeryStrong123',
        firstName: 'John',
        lastName: 'Doe',
        language: 'en',
        isDarkMode: false,
      }),
    ).rejects.toThrow('An account with this email address already exists.');

    expect(mockedCreateCoreUserRecord).not.toHaveBeenCalled();
    expect(mockedCreateTenantDatabase).not.toHaveBeenCalled();
  });

  /**
   * Verifies that registration rolls back persisted data when tenant bootstrap fails.
   */
  test('registerUser rolls back user and tenant database on tenant bootstrap failure', async () => {
    mockedFindCoreUserByEmail.mockResolvedValueOnce(null);
    mockedHash.mockResolvedValueOnce('hashed-password');
    mockedCreateCoreUserRecord.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: null,
    } satisfies CreatedCoreUserDto);
    mockedCreateTenantDatabase.mockRejectedValueOnce(new Error('DB bootstrap failed'));

    await expect(
      registerUser({
        email: 'john@example.com',
        password: 'VeryStrong123',
        firstName: 'John',
        lastName: 'Doe',
        language: 'pl',
        isDarkMode: false,
      }),
    ).rejects.toThrow('DB bootstrap failed');

    expect(mockedDeleteCoreUserRecordById).toHaveBeenCalledWith('user-1');
    expect(mockedDeleteTenantDatabase).toHaveBeenCalledWith(
      expect.stringMatching(/^tenant_john_/),
    );
  });

  /**
   * Verifies that registration rolls back persisted data when verification email delivery fails.
   */
  test('registerUser rolls back user and tenant database on verification email failure', async () => {
    mockedFindCoreUserByEmail.mockResolvedValueOnce(null);
    mockedHash.mockResolvedValueOnce('hashed-password');
    mockedCreateCoreUserRecord.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: null,
    } satisfies CreatedCoreUserDto);
    mockedSendVerificationEmail.mockRejectedValueOnce(
      new Error('SMTP unavailable'),
    );

    await expect(
      registerUser({
        email: 'john@example.com',
        password: 'VeryStrong123',
        firstName: 'John',
        lastName: 'Doe',
        language: 'pl',
        isDarkMode: false,
      }),
    ).rejects.toThrow('SMTP unavailable');

    expect(mockedDeleteCoreUserRecordById).toHaveBeenCalledWith('user-1');
    expect(mockedDeleteTenantDatabase).toHaveBeenCalledWith(
      expect.stringMatching(/^tenant_john_/),
    );
  });

  /**
   * Verifies that inactive users cannot authenticate even when found in Core.
   */
  test('authenticateUser returns null for inactive users', async () => {
    mockedFindCoreUserWithPasswordByEmail.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'hashed-password',
      isActive: false,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: '2026-03-20T00:00:00.000Z',
    } satisfies CoreUserAuthDto);

    const result = await authenticateUser({
      email: 'john@example.com',
      password: 'VeryStrong123',
    });

    expect(result).toBeNull();
    expect(mockedBcrypt.compare).not.toHaveBeenCalled();
  });

  /**
   * Verifies that authentication fails when the provided password does not match.
   */
  test('authenticateUser returns null for invalid passwords', async () => {
    mockedFindCoreUserWithPasswordByEmail.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'hashed-password',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: '2026-03-20T00:00:00.000Z',
    } satisfies CoreUserAuthDto);
    mockedCompare.mockResolvedValueOnce(false);

    const result = await authenticateUser({
      email: 'john@example.com',
      password: 'WrongPassword',
    });

    expect(result).toBeNull();
  });

  /**
   * Verifies that authentication returns the public user shape for valid credentials.
   */
  test('authenticateUser returns an authenticated user for valid credentials', async () => {
    mockedFindCoreUserWithPasswordByEmail.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'hashed-password',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: '2026-03-20T00:00:00.000Z',
    } satisfies CoreUserAuthDto);
    mockedCompare.mockResolvedValueOnce(true);

    const result = await authenticateUser({
      email: 'john@example.com',
      password: 'VeryStrong123',
    });

    expect(result).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
    });
  });

  /**
   * Verifies that login attempts report unverified accounts only after a valid password match.
   */
  test('authenticateUserAttempt reports email_not_verified for matching credentials', async () => {
    mockedFindCoreUserWithPasswordByEmail.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'hashed-password',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: null,
    } satisfies CoreUserAuthDto);
    mockedCompare.mockResolvedValueOnce(true);

    const result = await authenticateUserAttempt({
      email: 'john@example.com',
      password: 'VeryStrong123',
    });

    expect(result).toEqual({
      status: 'failure',
      reason: 'email_not_verified',
    });
  });

  /**
   * Verifies that valid verification tokens mark a Core user as verified.
   */
  test('verifyEmailAddress marks the email as verified', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-24T12:00:00.000Z'));
    mockedFindCoreUserByEmailVerificationTokenHash.mockResolvedValueOnce({
      id: 'user-1',
      emailVerifiedAt: null,
      emailVerificationTokenExpiresAt: '2026-03-25T12:00:00.000Z',
    } satisfies CoreUserEmailVerificationLookupDto);

    await verifyEmailAddress('token-123');

    expect(mockedFindCoreUserByEmailVerificationTokenHash).toHaveBeenCalledWith(
      expect.any(String),
    );
    expect(mockedMarkCoreUserEmailAsVerified).toHaveBeenCalledWith('user-1');
  });

  /**
   * Verifies that expired verification tokens are rejected.
   */
  test('verifyEmailAddress rejects expired tokens', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-24T12:00:00.000Z'));
    mockedFindCoreUserByEmailVerificationTokenHash.mockResolvedValueOnce({
      id: 'user-1',
      emailVerifiedAt: null,
      emailVerificationTokenExpiresAt: '2026-03-23T12:00:00.000Z',
    } satisfies CoreUserEmailVerificationLookupDto);

    await expect(verifyEmailAddress('token-123')).rejects.toThrow(
      'Verification link is invalid or has expired.',
    );

    expect(mockedMarkCoreUserEmailAsVerified).not.toHaveBeenCalled();
  });

  /**
   * Verifies that resendVerificationEmail rotates the token and sends a fresh email.
   */
  test('resendVerificationEmail refreshes the token for unverified accounts', async () => {
    mockedFindCoreUserForVerificationResend.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: null,
    } satisfies CoreUserVerificationResendDto);
    mockedFindTenantProfileByUserId.mockResolvedValueOnce({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: null,
      age: null,
      favoriteExerciseSlugs: [],
      location: null,
      heightCm: null,
      gender: null,
      activityLevel: null,
    } satisfies TenantProfileSnapshot);

    await resendVerificationEmail('john@example.com', 'pl');

    expect(mockedRefreshCoreUserEmailVerificationToken).toHaveBeenCalledWith(
      'user-1',
      expect.any(String),
      expect.any(Date),
    );
    expect(mockedSendVerificationEmail).toHaveBeenCalledWith({
      email: 'john@example.com',
      firstName: 'John',
      language: 'pl',
      verificationUrl: expect.stringContaining('/verify-email?'),
    });
  });

  /**
   * Verifies that resendVerificationEmail stays silent for unknown accounts.
   */
  test('resendVerificationEmail does nothing when the account does not exist', async () => {
    mockedFindCoreUserForVerificationResend.mockResolvedValueOnce(null);

    await resendVerificationEmail('missing@example.com', 'en');

    expect(mockedRefreshCoreUserEmailVerificationToken).not.toHaveBeenCalled();
    expect(mockedSendVerificationEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies that requestPasswordReset sends a reset email for verified accounts.
   */
  test('requestPasswordReset refreshes the password-reset token and sends an email', async () => {
    mockedFindCoreUserForPasswordResetRequest.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
      emailVerifiedAt: '2026-03-20T12:00:00.000Z',
    } satisfies CoreUserPasswordResetRequestDto);
    mockedFindTenantProfileByUserId.mockResolvedValueOnce({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: null,
      age: null,
      favoriteExerciseSlugs: [],
      location: null,
      heightCm: null,
      gender: null,
      activityLevel: null,
    } satisfies TenantProfileSnapshot);

    await requestPasswordReset('john@example.com', 'sv');

    expect(mockedRefreshCoreUserPasswordResetToken).toHaveBeenCalledWith(
      'user-1',
      expect.any(String),
      expect.any(Date),
    );
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith({
      email: 'john@example.com',
      firstName: 'John',
      language: 'sv',
      resetUrl: expect.stringContaining('/reset-password?'),
    });
  });

  /**
   * Verifies that requestPasswordReset stays silent for unknown accounts.
   */
  test('requestPasswordReset does nothing when the account does not exist', async () => {
    mockedFindCoreUserForPasswordResetRequest.mockResolvedValueOnce(null);

    await requestPasswordReset('missing@example.com', 'en');

    expect(mockedRefreshCoreUserPasswordResetToken).not.toHaveBeenCalled();
    expect(mockedSendPasswordResetEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies that resetPasswordWithToken updates the password and clears the token.
   */
  test('resetPasswordWithToken updates the password for a valid token', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-24T12:00:00.000Z'));
    mockedFindCoreUserByPasswordResetTokenHash.mockResolvedValueOnce({
      id: 'user-1',
      passwordResetTokenExpiresAt: '2026-03-24T13:00:00.000Z',
    } satisfies CoreUserPasswordResetLookupDto);
    mockedHash.mockResolvedValueOnce('hashed-new-password');

    await resetPasswordWithToken({
      token: 'reset-token-123',
      newPassword: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    });

    expect(mockedResetCoreUserPasswordByToken).toHaveBeenCalledWith(
      'user-1',
      'hashed-new-password',
    );
  });

  /**
   * Verifies that resetPasswordWithToken rejects expired tokens.
   */
  test('resetPasswordWithToken rejects expired tokens', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-24T12:00:00.000Z'));
    mockedFindCoreUserByPasswordResetTokenHash.mockResolvedValueOnce({
      id: 'user-1',
      passwordResetTokenExpiresAt: '2026-03-24T11:00:00.000Z',
    } satisfies CoreUserPasswordResetLookupDto);

    await expect(
      resetPasswordWithToken({
        token: 'reset-token-123',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }),
    ).rejects.toThrow('PASSWORD_RESET_INVALID');

    expect(mockedResetCoreUserPasswordByToken).not.toHaveBeenCalled();
  });

  /**
   * Verifies that tenant profile and settings are mapped into the snapshot shape used by the UI.
   */
  test('getAuthenticatedUserSnapshot maps profile and settings data', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-22T12:00:00.000Z'));

    mockedFindTenantProfileByUserId.mockResolvedValueOnce({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1995-03-22T00:00:00.000Z',
      age: null,
      favoriteExerciseSlugs: ['bench-press'],
      location: {
        provider: 'google_places',
        placeId: 'place-1',
        displayName: 'Stockholm',
        formattedAddress: 'Stockholm, Sweden',
        latitude: 59.3293,
        longitude: 18.0686,
        countryCode: 'SE',
        country: 'Sweden',
        region: 'Stockholm County',
        city: 'Stockholm',
        locality: 'Stockholm',
        postalCode: null,
      },
      heightCm: 180,
      gender: 'male',
      activityLevel: 'moderately_active',
    } satisfies TenantProfileSnapshot);
    mockedFindTenantSettings.mockResolvedValueOnce({
      language: 'sv',
      isDarkMode: true,
      unitSystem: 'imperial_uk',
      trackMenstrualCycle: true,
      trackLibido: false,
    } satisfies TenantSettingsSnapshot);
    mockedFindTenantHealthyHabits.mockResolvedValueOnce({
      averageSleepHoursPerDay: 7.5,
      stepsPerDay: 9000,
      waterLitersPerDay: 2,
      proteinGramsPerDay: 150,
      strengthWorkoutsPerWeek: 3,
      cardioMinutesPerWeek: 120,
      regularSleepSchedule: true,
    } satisfies TenantHealthyHabitsSnapshot);

    const result = await getAuthenticatedUserSnapshot(
      'tenant_john_123456789abc',
      'user-1',
    );

    expect(result).toEqual({
      profile: {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1995-03-22T00:00:00.000Z',
        age: 31,
        favoriteExerciseSlugs: ['bench-press'],
        location: {
          provider: 'google_places',
          placeId: 'place-1',
          displayName: 'Stockholm',
          formattedAddress: 'Stockholm, Sweden',
          latitude: 59.3293,
          longitude: 18.0686,
          countryCode: 'SE',
          country: 'Sweden',
          region: 'Stockholm County',
          city: 'Stockholm',
          locality: 'Stockholm',
          postalCode: null,
        },
        heightCm: 180,
        gender: 'male',
        activityLevel: 'moderately_active',
      },
      settings: {
        language: 'sv',
        isDarkMode: true,
        unitSystem: 'imperial_uk',
        trackMenstrualCycle: true,
        trackLibido: false,
      },
      healthyHabits: {
        averageSleepHoursPerDay: 7.5,
        stepsPerDay: 9000,
        waterLitersPerDay: 2,
        proteinGramsPerDay: 150,
        strengthWorkoutsPerWeek: 3,
        cardioMinutesPerWeek: 120,
        regularSleepSchedule: true,
      },
      favoriteExerciseSlugs: ['bench-press'],
    });
  });
});
