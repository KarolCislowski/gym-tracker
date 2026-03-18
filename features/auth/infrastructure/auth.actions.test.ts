import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('next-auth', () => ({
  AuthError: class AuthError extends Error {},
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('@/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../application/auth.service', () => ({
  registerUser: vi.fn(),
}));

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

import { registerUser } from '../application/auth.service';
import { loginAction, logoutAction, registerAction } from './auth.actions';

const mockedRegisterUser = vi.mocked(registerUser);
const mockedSignIn = vi.mocked(signIn);
const mockedSignOut = vi.mocked(signOut);

/**
 * Builds FormData payloads for server action tests, including checkbox semantics.
 */
function createFormData(
  entries: Record<string, string | boolean>,
): FormData {
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

describe('auth.actions', () => {
  /**
   * Resets mock state before each server action scenario.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifies that registration actions pass parsed values forward
   * and preserve the selected UI language in the success redirect.
   */
  test('registerAction sends parsed form values to registerUser and redirects to localized login', async () => {
    mockedRegisterUser.mockResolvedValueOnce({
      id: 'user-1',
      email: 'john@example.com',
      isActive: true,
      tenantDbName: 'tenant_john',
    });

    await expect(
      registerAction(
        createFormData({
          email: 'john@example.com',
          password: 'VeryStrong123',
          firstName: 'John',
          lastName: 'Doe',
          language: 'sv',
          uiLanguage: 'pl',
          isDarkMode: true,
        }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT:/login?lang=pl&registered=1');

    expect(mockedRegisterUser).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'VeryStrong123',
      firstName: 'John',
      lastName: 'Doe',
      language: 'sv',
      isDarkMode: true,
    });
  });

  /**
   * Verifies that registration errors redirect back to the localized register page.
   */
  test('registerAction redirects back to localized register on error', async () => {
    mockedRegisterUser.mockRejectedValueOnce(new Error('Registration failed'));

    await expect(
      registerAction(
        createFormData({
          email: 'john@example.com',
          password: 'VeryStrong123',
          firstName: 'John',
          lastName: 'Doe',
          language: 'en',
          uiLanguage: 'sv',
        }),
      ),
    ).rejects.toThrow(
      'NEXT_REDIRECT:/register?lang=sv&error=Registration%20failed',
    );
  });

  /**
   * Verifies that login actions delegate authentication to Auth.js credentials sign-in.
   */
  test('loginAction calls signIn with credentials', async () => {
    mockedSignIn.mockResolvedValueOnce(undefined as never);

    await loginAction(
      createFormData({
        email: 'john@example.com',
        password: 'VeryStrong123',
        uiLanguage: 'en',
      }),
    );

    expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
      email: 'john@example.com',
      password: 'VeryStrong123',
      redirectTo: '/',
    });
  });

  /**
   * Verifies that Auth.js credential failures redirect back to the localized login page.
   */
  test('loginAction redirects back to localized login on AuthError', async () => {
    mockedSignIn.mockRejectedValueOnce(new AuthError('CredentialsSignin'));

    await expect(
      loginAction(
        createFormData({
          email: 'john@example.com',
          password: 'WrongPassword',
          uiLanguage: 'sv',
        }),
      ),
    ).rejects.toThrow(
      'NEXT_REDIRECT:/login?lang=sv&error=Invalid%20email%20or%20password.',
    );
  });

  /**
   * Verifies that logout redirects the user back to the login page.
   */
  test('logoutAction signs the user out to the login page', async () => {
    mockedSignOut.mockResolvedValueOnce(undefined as never);

    await logoutAction();

    expect(mockedSignOut).toHaveBeenCalledWith({
      redirectTo: '/login',
    });
  });
});
