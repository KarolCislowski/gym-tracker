'use client';

import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface AppHeaderProps {
  displayName: string;
  logoutAction: (formData: FormData) => Promise<void>;
  onOpenMobileNavigation: () => void;
  translations: TranslationDictionary;
}

/**
 * Shared application header displayed across authenticated dashboard pages.
 */
export function AppHeader({
  displayName,
  logoutAction,
  onOpenMobileNavigation,
  translations,
}: AppHeaderProps) {
  const t = translations.dashboard;

  return (
    <AppBar
      position='sticky'
      color='transparent'
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'background.default',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <IconButton
            aria-label={t.openNavigation}
            onClick={onOpenMobileNavigation}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <FitnessCenterRoundedIcon />
            </Avatar>
            <Box>
              <Typography variant='subtitle1' fontWeight={700}>
                {t.appName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t.workspace}
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Stack direction='row' spacing={1.5} alignItems='center'>
          <Chip label={displayName} variant='outlined' />
          <Box component='form' action={logoutAction}>
            <Button
              startIcon={<LogoutRoundedIcon />}
              type='submit'
              variant='contained'
            >
              {t.signOut}
            </Button>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
