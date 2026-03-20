'use client';

import { useEffect } from 'react';

import type { AppColorMode } from '../domain/theme.types';
import { useAppThemeMode } from '../app-theme-provider';

interface ThemeModeSyncProps {
  mode: AppColorMode;
}

/**
 * Synchronizes the global theme provider with server-derived mode changes.
 * @param props - Component props for theme synchronization.
 * @param props.mode - The desired application color mode derived from server state.
 * @returns `null` because the component performs only a synchronization side effect.
 * @remarks This helper is useful when persisted server preferences should immediately update the client theme.
 */
export function ThemeModeSync({ mode }: ThemeModeSyncProps) {
  const { mode: currentMode, setMode } = useAppThemeMode();

  useEffect(() => {
    if (currentMode !== mode) {
      setMode(mode);
    }
  }, [currentMode, mode, setMode]);

  return null;
}
