import { Box, Paper, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { LanguageSwitcher } from '@/shared/i18n/ui/language-switcher';
import type { AppColorMode } from '@/shared/theme/domain/theme.types';
import { ColorModeSwitcher } from '@/shared/theme/ui/color-mode-switcher';

interface AuthPageShellProps {
  activeColorMode: AppColorMode;
  activeLanguage: string;
  children: React.ReactNode;
  pathname: string;
  query?: Record<string, string | undefined>;
  subtitle: string;
  title: string;
  translations: TranslationDictionary;
  width: string;
}

/**
 * Shared layout shell for authentication screens.
 */
export function AuthPageShell({
  activeColorMode,
  activeLanguage,
  children,
  pathname,
  query,
  subtitle,
  title,
  translations,
  width,
}: AuthPageShellProps) {
  return (
    <Box
      component='main'
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width,
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 6,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <LanguageSwitcher
              activeLanguage={activeLanguage}
              pathname={pathname}
              query={query}
            />
            <ColorModeSwitcher mode={activeColorMode} />
          </Stack>
          <Typography variant='overline' color='text.secondary'>
            {translations.auth.appName}
          </Typography>
          <Typography component='h1' variant='h2'>
            {title}
          </Typography>
          <Typography color='text.secondary'>{subtitle}</Typography>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
