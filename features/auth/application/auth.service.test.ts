import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type {
  CoreUserAuthDto,
  CoreUserLookupDto,
  CreatedCoreUserDto,
  TenantProfileSnapshot,
  TenantSettingsSnapshot,
} from '../domain/auth.types';

import {
  authenticateUser,
  getAuthenticatedUserSnapshot,
  registerUser,
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
  findCoreUserWithPasswordByEmail: vi.fn(),
  findTenantProfileByUserId: vi.fn(),
  findTenantSettings: vi.fn(),
}));

import {
  createCoreUserRecord,
  createTenantDatabase,
  deleteCoreUserRecordById,
  deleteTenantDatabase,
  findCoreUserByEmail,
  findCoreUserWithPasswordByEmail,
  findTenantProfileByUserId,
  findTenantSettings,
} from '../infrastructure/auth.db';

const mockedBcrypt = vi.mocked(bcrypt);
const mockedCreateCoreUserRecord = vi.mocked(createCoreUserRecord);
const mockedCreateTenantDatabase = vi.mocked(createTenantDatabase);
const mockedDeleteCoreUserRecordById = vi.mocked(deleteCoreUserRecordById);
const mockedDeleteTenantDatabase = vi.mocked(deleteTenantDatabase);
const mockedFindCoreUserByEmail = vi.mocked(findCoreUserByEmail);
const mockedFindCoreUserWithPasswordByEmail = vi.mocked(
  findCoreUserWithPasswordByEmail,
);
const mockedFindTenantProfileByUserId = vi.mocked(findTenantProfileByUserId);
const mockedFindTenantSettings = vi.mocked(findTenantSettings);
const mockedHash = mockedBcrypt.hash as unknown as ReturnType<typeof vi.fn>;
const mockedCompare = mockedBcrypt.compare as unknown as ReturnType<typeof vi.fn>;

describe('auth.service', () => {
  /**
   * Resets mock state before each scenario so assertions stay isolated.
   */
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(result).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john_123456789abc',
    });
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
   * Verifies that inactive users cannot authenticate even when found in Core.
   */
  test('authenticateUser returns null for inactive users', async () => {
    mockedFindCoreUserWithPasswordByEmail.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'hashed-password',
      isActive: false,
      tenantDbName: 'tenant_john_123456789abc',
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
   * Verifies that tenant profile and settings are mapped into the snapshot shape used by the UI.
   */
  test('getAuthenticatedUserSnapshot maps profile and settings data', async () => {
    mockedFindTenantProfileByUserId.mockResolvedValueOnce({
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      age: 31,
      gender: 'male',
      activityLevel: 'moderately_active',
    } satisfies TenantProfileSnapshot);
    mockedFindTenantSettings.mockResolvedValueOnce({
      language: 'sv',
      isDarkMode: true,
      unitSystem: 'imperial_uk',
    } satisfies TenantSettingsSnapshot);

    const result = await getAuthenticatedUserSnapshot(
      'tenant_john_123456789abc',
      'user-1',
    );

    expect(result).toEqual({
      profile: {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 31,
        gender: 'male',
        activityLevel: 'moderately_active',
      },
      settings: {
        language: 'sv',
        isDarkMode: true,
        unitSystem: 'imperial_uk',
      },
    });
  });
});
