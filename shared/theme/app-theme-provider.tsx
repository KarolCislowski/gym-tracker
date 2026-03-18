'use client';

import { useMemo } from 'react';
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

export function AppThemeProvider({
  children,
  mode,
}: AppThemeProviderProps) {
  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
