import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../application/settings.service', () => ({
  changeUserPassword: vi.fn(),
  deleteUserAccount: vi.fn(),
  updateTenantSettings: vi.fn(),
}));

import { auth, signOut } from '@/auth';

import {
  changeUserPassword,
  deleteUserAccount,
  updateTenantSettings,
} from '../application/settings.service';
import {
  changePasswordAction,
  deleteAccountAction,
  updateSettingsAction,
} from './settings.actions';

const mockedAuth = vi.mocked(auth);
const mockedSignOut = vi.mocked(signOut);
const mockedChangeUserPassword = vi.mocked(changeUserPassword);
const mockedDeleteUserAccount = vi.mocked(deleteUserAccount);
const mockedUpdateTenantSettings = vi.mocked(updateTenantSettings);

function createFormData(entries: Record<string, string | boolean>): FormData {
  const formData = new FormData();

  Object.entries(entries).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      if (value) {
        formData.set(key, 'on');
      }

      return;
    }

    formData.set(key, value);
  });

  return formData;
}

describe('settings.actions', () => {
  /**
   * Resets mock state before each action scenario.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAuth.mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'john@example.com',
        tenantDbName: 'tenant_john',
      },
    } as unknown as Awaited<ReturnType<typeof auth>>);
  });

  /**
   * Verifies that preference updates are delegated with authenticated tenant context.
   */
  test('updateSettingsAction sends tenant preference values to the service', async () => {
    await expect(
      updateSettingsAction(
        createFormData({
          language: 'sv',
          isDarkMode: true,
        }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT:/settings?status=preferences-updated');

    expect(mockedUpdateTenantSettings).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      language: 'sv',
      isDarkMode: true,
    });
  });

  /**
   * Verifies that password changes redirect back with a stable error code on failure.
   */
  test('changePasswordAction redirects back to settings on failure', async () => {
    mockedChangeUserPassword.mockRejectedValueOnce(
      new Error('SETTINGS_ERROR_INVALID_CURRENT_PASSWORD'),
    );

    await expect(
      changePasswordAction(
        createFormData({
          currentPassword: 'OldPassword123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        }),
      ),
    ).rejects.toThrow(
      'NEXT_REDIRECT:/settings?error=SETTINGS_ERROR_INVALID_CURRENT_PASSWORD',
    );
  });

  /**
   * Verifies that account deletion signs the user out to the deleted-account login state.
   */
  test('deleteAccountAction deletes the account and signs the user out', async () => {
    mockedSignOut.mockResolvedValueOnce(undefined as never);

    await deleteAccountAction(
      createFormData({
        currentPassword: 'OldPassword123',
        confirmationEmail: 'john@example.com',
      }),
    );

    expect(mockedDeleteUserAccount).toHaveBeenCalledWith({
      userId: 'user-1',
      currentPassword: 'OldPassword123',
      confirmationEmail: 'john@example.com',
    });
    expect(mockedSignOut).toHaveBeenCalledWith({
      redirectTo: '/login?deleted=1',
    });
  });
});
