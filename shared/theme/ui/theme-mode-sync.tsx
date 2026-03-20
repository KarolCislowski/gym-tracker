'use client';

import { useEffect } from 'react';

import type { AppColorMode } from '../domain/theme.types';
import { useAppThemeMode } from '../app-theme-provider';

interface ThemeModeSyncProps {
  mode: AppColorMode;
}

/**
 * Synchronizes the global theme provider with server-derived mode changes.
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
