'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import type { AppColorMode } from './domain/theme.types';
import { getAppTheme } from './app-theme';

interface AppThemeProviderProps {
  children: React.ReactNode;
  mode: AppColorMode;
}

interface AppThemeModeContextValue {
  mode: AppColorMode;
  setMode: (mode: AppColorMode) => void;
}

const AppThemeModeContext = createContext<AppThemeModeContextValue | null>(null);

/**
 * Returns the current theme mode context used by the app shell and theme-related controls.
 * @returns The active theme mode plus its setter.
 * @throws When called outside the app theme provider tree.
 */
export function useAppThemeMode(): AppThemeModeContextValue {
  const context = useContext(AppThemeModeContext);

  if (!context) {
    throw new Error('useAppThemeMode must be used within AppThemeProvider.');
  }

  return context;
}

/**
 * Wraps the app with Material UI theme infrastructure and exposes a mutable color-mode context.
 * @param props - Component props for the app theme provider.
 * @param props.children - Descendant UI that should receive the current theme and localization providers.
 * @param props.mode - Initial color mode resolved from the current user or guest preference.
 * @returns A React element rendering the shared theme providers for the app.
 */
export function AppThemeProvider({
  children,
  mode,
}: AppThemeProviderProps) {
  const [currentMode, setCurrentMode] = useState<AppColorMode>(mode);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const theme = useMemo(() => getAppTheme(currentMode), [currentMode]);
  const contextValue = useMemo(
    () => ({
      mode: currentMode,
      setMode: setCurrentMode,
    }),
    [currentMode],
  );

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <AppThemeModeContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </AppThemeModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
