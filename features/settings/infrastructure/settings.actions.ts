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

function getSettingsErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'SETTINGS_ERROR_GENERIC';
}
