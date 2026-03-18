'use server';

import { cookies } from 'next/headers';

import { COLOR_MODE_COOKIE_NAME, resolveAppColorMode } from '../application/theme-mode';
import type { AppColorMode } from '../domain/theme.types';

/**
 * Persists the guest color mode preference for unauthenticated screens.
 */
export async function setGuestColorModePreference(
  mode: AppColorMode,
): Promise<void> {
  const cookieStore = await cookies();
  const safeMode = resolveAppColorMode(mode);

  cookieStore.set(COLOR_MODE_COOKIE_NAME, safeMode, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  });
}
