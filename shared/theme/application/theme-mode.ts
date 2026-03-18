import type { AppColorMode } from '../domain/theme.types';

export const COLOR_MODE_COOKIE_NAME = 'ui-color-mode';

/**
 * Resolves the app color mode from a persisted preference.
 */
export function resolveAppColorMode(
  value?: string | null,
): AppColorMode {
  return value === 'dark' ? 'dark' : 'light';
}

/**
 * Converts a boolean dark-mode setting into an app color mode.
 */
export function getColorModeFromSettings(
  isDarkMode?: boolean | null,
): AppColorMode {
  return isDarkMode ? 'dark' : 'light';
}
