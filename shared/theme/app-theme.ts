import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import type { AppColorMode } from './domain/theme.types';

export function getAppTheme(mode: AppColorMode) {
  let appTheme = createTheme({
    cssVariables: true,
    palette: {
      mode,
    },
    typography: {
      fontFamily: 'var(--font-geist-sans), sans-serif',
    },
  });

  appTheme = responsiveFontSizes(appTheme);

  return appTheme;
}
