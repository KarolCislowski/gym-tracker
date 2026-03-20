'use server';

import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';

import {
  changeUserPassword,
  deleteUserAccount,
  updateTenantSettings,
} from '../application/settings.service';

/**
 * Persists tenant preference updates.
 * @param formData - Submitted form data containing tenant preference values.
 * @returns A promise that resolves only through redirect handling.
 * @remarks The action always redirects either to a success status or to an error code on the settings route.
 */
export async function updateSettingsAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.tenantDbName) {
    redirect('/login');
  }

  try {
    await updateTenantSettings({
      tenantDbName: session.user.tenantDbName,
      language: String(formData.get('language') ?? 'en'),
      isDarkMode: formData.get('isDarkMode') === 'on',
    });
  } catch (error) {
    redirect(`/settings?error=${encodeURIComponent(getSettingsErrorCode(error))}`);
  }

  redirect('/settings?status=preferences-updated');
}

/**
 * Changes the signed-in user's password.
 * @param formData - Submitted form data containing current and next password values.
 * @returns A promise that resolves only through redirect handling.
 * @remarks Password update outcomes are encoded as query params so the route can render translated feedback.
 */
export async function changePasswordAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
    await changeUserPassword({
      userId: session.user.id,
      currentPassword: String(formData.get('currentPassword') ?? ''),
      newPassword: String(formData.get('newPassword') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    });
  } catch (error) {
    redirect(`/settings?error=${encodeURIComponent(getSettingsErrorCode(error))}`);
  }

  redirect('/settings?status=password-updated');
}

/**
 * Deletes the signed-in account after explicit confirmation.
 * @param formData - Submitted form data containing deletion confirmation values.
 * @returns A promise that resolves by signing the user out and redirecting to the login route.
 * @remarks Successful deletion immediately invalidates the session and navigates to a deleted-account state.
 */
export async function deleteAccountAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    redirect('/login');
  }

  try {
    await deleteUserAccount({
      userId: session.user.id,
      currentPassword: String(formData.get('currentPassword') ?? ''),
      confirmationEmail: String(formData.get('confirmationEmail') ?? ''),
    });
  } catch (error) {
    redirect(`/settings?error=${encodeURIComponent(getSettingsErrorCode(error))}`);
  }

  await signOut({
    redirectTo: '/login?deleted=1',
  });
}

/**
 * Extracts a stable settings error code from thrown values.
 * @param error - Unknown error value thrown by validation or persistence code.
 * @returns A stable error code string understood by the settings UI.
 * @remarks Unknown failures collapse to a generic code to keep user-facing messaging predictable.
 */
function getSettingsErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'SETTINGS_ERROR_GENERIC';
}
