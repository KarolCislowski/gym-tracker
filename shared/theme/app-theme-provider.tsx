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

export function useAppThemeMode(): AppThemeModeContextValue {
  const context = useContext(AppThemeModeContext);

  if (!context) {
    throw new Error('useAppThemeMode must be used within AppThemeProvider.');
  }

  return context;
}

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
