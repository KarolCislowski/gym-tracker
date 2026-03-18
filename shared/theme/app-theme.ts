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
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            minHeight: 56,
          },
          input: {
            paddingTop: 16.5,
            paddingBottom: 16.5,
          },
        },
      },
    },
  });

  appTheme = responsiveFontSizes(appTheme);

  return appTheme;
}
