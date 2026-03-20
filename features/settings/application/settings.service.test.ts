import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  changeUserPassword,
  deleteUserAccount,
  updateTenantSettings,
} from './settings.service';

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('../infrastructure/settings.db', () => ({
  deleteCoreUserRecord: vi.fn(),
  deleteTenantDatabaseRecord: vi.fn(),
  findCoreUserSecurityById: vi.fn(),
  updateCoreUserPasswordRecord: vi.fn(),
  updateTenantSettingsRecord: vi.fn(),
}));

import {
  deleteCoreUserRecord,
  deleteTenantDatabaseRecord,
  findCoreUserSecurityById,
  updateCoreUserPasswordRecord,
  updateTenantSettingsRecord,
} from '../infrastructure/settings.db';

const mockedBcrypt = vi.mocked(bcrypt);
const mockedCompare = mockedBcrypt.compare as unknown as ReturnType<typeof vi.fn>;
const mockedHash = mockedBcrypt.hash as unknown as ReturnType<typeof vi.fn>;
const mockedDeleteCoreUserRecord = vi.mocked(deleteCoreUserRecord);
const mockedDeleteTenantDatabaseRecord = vi.mocked(deleteTenantDatabaseRecord);
const mockedFindCoreUserSecurityById = vi.mocked(findCoreUserSecurityById);
const mockedUpdateCoreUserPasswordRecord = vi.mocked(updateCoreUserPasswordRecord);
const mockedUpdateTenantSettingsRecord = vi.mocked(updateTenantSettingsRecord);

describe('settings.service', () => {
  /**
   * Resets mocks before each scenario.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifies that tenant preferences are persisted to the tenant settings document.
   */
  test('updateTenantSettings updates tenant preferences', async () => {
    await updateTenantSettings({
      tenantDbName: 'tenant_john',
      language: 'sv',
      isDarkMode: true,
    });

    expect(mockedUpdateTenantSettingsRecord).toHaveBeenCalledWith('tenant_john', {
      language: 'sv',
      isDarkMode: true,
    });
  });

  /**
   * Verifies that password changes validate the current password and persist a new hash.
   */
  test('changeUserPassword updates the password hash for valid credentials', async () => {
    mockedFindCoreUserSecurityById.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'old-hash',
      tenantDbName: 'tenant_john',
    });
    mockedCompare.mockResolvedValueOnce(true);
    mockedHash.mockResolvedValueOnce('new-hash');

    await changeUserPassword({
      userId: 'user-1',
      currentPassword: 'OldPassword123',
      newPassword: 'NewPassword123',
      confirmPassword: 'NewPassword123',
    });

    expect(mockedBcrypt.compare).toHaveBeenCalledWith('OldPassword123', 'old-hash');
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('NewPassword123', 12);
    expect(mockedUpdateCoreUserPasswordRecord).toHaveBeenCalledWith(
      'user-1',
      'new-hash',
    );
  });

  /**
   * Verifies that password changes reject an invalid current password.
   */
  test('changeUserPassword rejects invalid current passwords', async () => {
    mockedFindCoreUserSecurityById.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'old-hash',
      tenantDbName: 'tenant_john',
    });
    mockedCompare.mockResolvedValueOnce(false);

    await expect(
      changeUserPassword({
        userId: 'user-1',
        currentPassword: 'WrongPassword123',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }),
    ).rejects.toThrow('SETTINGS_ERROR_INVALID_CURRENT_PASSWORD');
  });

  /**
   * Verifies that password changes reject mismatched password confirmation.
   */
  test('changeUserPassword rejects mismatched password confirmation', async () => {
    await expect(
      changeUserPassword({
        userId: 'user-1',
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
        confirmPassword: 'OtherPassword123',
      }),
    ).rejects.toThrow('SETTINGS_ERROR_PASSWORD_CONFIRMATION_MISMATCH');
  });

  /**
   * Verifies that account deletion requires a matching email confirmation.
   */
  test('deleteUserAccount rejects mismatched confirmation emails', async () => {
    mockedFindCoreUserSecurityById.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'old-hash',
      tenantDbName: 'tenant_john',
    });

    await expect(
      deleteUserAccount({
        userId: 'user-1',
        currentPassword: 'OldPassword123',
        confirmationEmail: 'other@example.com',
      }),
    ).rejects.toThrow('SETTINGS_ERROR_CONFIRMATION_EMAIL_MISMATCH');
  });

  /**
   * Verifies that account deletion removes both the Core user and tenant database.
   */
  test('deleteUserAccount removes the user and tenant database after confirmation', async () => {
    mockedFindCoreUserSecurityById.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      password: 'old-hash',
      tenantDbName: 'tenant_john',
    });
    mockedCompare.mockResolvedValueOnce(true);

    await deleteUserAccount({
      userId: 'user-1',
      currentPassword: 'OldPassword123',
      confirmationEmail: 'john@example.com',
    });

    expect(mockedDeleteCoreUserRecord).toHaveBeenCalledWith('user-1');
    expect(mockedDeleteTenantDatabaseRecord).toHaveBeenCalledWith('tenant_john');
  });
});
