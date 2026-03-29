'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import { resetDashboardLayout, saveDashboardLayout } from '../application/dashboard-layout.service';

/**
 * Persists dashboard layout preferences for the authenticated user.
 * @param formData - Submitted customization form payload containing serialized layout items.
 * @returns A promise that resolves only through redirect handling.
 */
export async function saveDashboardLayoutAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  try {
    const rawItems = String(formData.get('items') ?? '[]');

    await saveDashboardLayout({
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      items: JSON.parse(rawItems) as [],
    });
  } catch (error) {
    redirect(`/?error=${encodeURIComponent(getDashboardLayoutErrorCode(error))}`);
  }

  redirect('/?status=dashboard-layout-updated');
}

/**
 * Resets the dashboard layout to the default arrangement for the authenticated user.
 * @returns A promise that resolves only through redirect handling.
 */
export async function resetDashboardLayoutAction(): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  try {
    await resetDashboardLayout(session.user.tenantDbName, session.user.id);
  } catch (error) {
    redirect(`/?error=${encodeURIComponent(getDashboardLayoutErrorCode(error))}`);
  }

  redirect('/?status=dashboard-layout-reset');
}

function getDashboardLayoutErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'DASHBOARD_LAYOUT_ERROR_GENERIC';
}
