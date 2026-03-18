'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/auth';

import { registerUser } from '../application/auth.service';

/**
 * Handles user registration and initializes the tenant database.
 */
export async function registerAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const firstName = String(formData.get('firstName') ?? '');
  const lastName = String(formData.get('lastName') ?? '');
  const language = String(formData.get('language') ?? 'en');
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
      `/register?error=${encodeURIComponent(getActionErrorMessage(error))}`,
    );
  }

  redirect('/login?registered=1');
}

/**
 * Authenticates a user with email and password using Auth.js credentials.
 */
export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect('/login?error=Invalid%20email%20or%20password.');
    }

    throw error;
  }
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
