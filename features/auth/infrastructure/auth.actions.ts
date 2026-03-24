'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/auth';

import {
  authenticateUserAttempt,
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
  resendVerificationEmail,
} from '../application/auth.service';

/**
 * Handles user registration and initializes the tenant database.
 */
export async function registerAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const firstName = String(formData.get('firstName') ?? '');
  const lastName = String(formData.get('lastName') ?? '');
  const language = String(formData.get('language') ?? 'en');
  const uiLanguage = String(formData.get('uiLanguage') ?? 'en');
  const isDarkMode = formData.get('isDarkMode') === 'on';

  try {
    await registerUser({
      email,
      password,
      firstName,
      lastName,
      language,
      isDarkMode,
    });
  } catch (error) {
    redirect(
      `/register?lang=${encodeURIComponent(uiLanguage)}&error=${encodeURIComponent(getActionErrorMessage(error))}`,
    );
  }

  redirect(`/login?lang=${encodeURIComponent(uiLanguage)}&registered=1`);
}

/**
 * Authenticates a user with email and password using Auth.js credentials.
 */
export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const uiLanguage = String(formData.get('uiLanguage') ?? 'en');
  const attempt = await authenticateUserAttempt({
    email,
    password,
  });

  if (attempt.status === 'failure') {
    const errorQuery =
      attempt.reason === 'email_not_verified'
        ? `error=${encodeURIComponent(attempt.reason)}&email=${encodeURIComponent(email)}`
        : `error=${encodeURIComponent(attempt.reason)}`;

    redirect(
      `/login?lang=${encodeURIComponent(uiLanguage)}&${errorQuery}`,
    );
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(
        `/login?lang=${encodeURIComponent(uiLanguage)}&error=invalid_credentials`,
      );
    }

    throw error;
  }
}

/**
 * Resends a verification email when the account exists and is still unverified.
 */
export async function resendVerificationEmailAction(
  formData: FormData,
): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const uiLanguage = String(formData.get('uiLanguage') ?? 'en');

  try {
    await resendVerificationEmail(email, uiLanguage);
  } catch (error) {
    redirect(
      `/login?lang=${encodeURIComponent(uiLanguage)}&error=${encodeURIComponent(getActionErrorMessage(error))}`,
    );
  }

  redirect(`/login?lang=${encodeURIComponent(uiLanguage)}&resent=1`);
}

/**
 * Starts the password-reset flow by sending a reset link email.
 */
export async function requestPasswordResetAction(
  formData: FormData,
): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const uiLanguage = String(formData.get('uiLanguage') ?? 'en');

  try {
    await requestPasswordReset(email, uiLanguage);
  } catch (error) {
    redirect(
      `/forgot-password?lang=${encodeURIComponent(uiLanguage)}&error=${encodeURIComponent(getActionErrorMessage(error))}`,
    );
  }

  redirect(`/forgot-password?lang=${encodeURIComponent(uiLanguage)}&sent=1`);
}

/**
 * Completes the password-reset flow by setting a new password from a one-time token.
 */
export async function resetPasswordAction(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '');
  const uiLanguage = String(formData.get('uiLanguage') ?? 'en');
  const newPassword = String(formData.get('newPassword') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  try {
    await resetPasswordWithToken({
      token,
      newPassword,
      confirmPassword,
    });
  } catch (error) {
    const errorCode =
      error instanceof Error &&
      (error.message === 'PASSWORD_RESET_INVALID' ||
        error.message === 'PASSWORD_CONFIRMATION_MISMATCH')
        ? error.message
        : getActionErrorMessage(error);

    redirect(
      `/reset-password?lang=${encodeURIComponent(uiLanguage)}&token=${encodeURIComponent(token)}&error=${encodeURIComponent(errorCode)}`,
    );
  }

  redirect(`/login?lang=${encodeURIComponent(uiLanguage)}&passwordReset=1`);
}

/**
 * Signs the current user out.
 */
export async function logoutAction(): Promise<void> {
  await signOut({
    redirectTo: '/login',
  });
}

function getActionErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
