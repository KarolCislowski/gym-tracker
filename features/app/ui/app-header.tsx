'use client';

import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
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
 * @param props - Component props for the authenticated header.
 * @param props.displayName - Display name of the signed-in user.
 * @param props.logoutAction - Server action used to sign the current user out.
 * @param props.onOpenMobileNavigation - Callback that opens the mobile side navigation.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the authenticated header.
 * @remarks The header remains client-side because it forwards interaction callbacks to the shell state.
 */
export function AppHeader({
  displayName: _displayName,
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
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          gap: 2,
          position: 'relative',
        }}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <IconButton
            aria-label={t.openNavigation}
            onClick={onOpenMobileNavigation}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Stack
            direction='row'
            spacing={1.5}
            alignItems='center'
            sx={{
              position: { xs: 'absolute', sm: 'static' },
              left: { xs: '50%', sm: 'auto' },
              transform: { xs: 'translateX(-50%)', sm: 'none' },
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <FitnessCenterRoundedIcon />
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
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
          <Box component='form' action={logoutAction}>
            <Tooltip title={t.signOut}>
              <IconButton
                aria-label={t.signOut}
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                type='submit'
              >
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
            <Button
              size='small'
              startIcon={<LogoutRoundedIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              type='submit'
              variant='outlined'
            >
              {t.signOut}
            </Button>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
