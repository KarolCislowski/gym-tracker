import Link from 'next/link';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import {
  getProfileActivityLabel,
  getProfileSexLabel,
} from '@/features/profile/application/profile-view';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardHomeProps {
  tenantDbName: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Main dashboard overview content rendered inside the shared authenticated shell.
 */
export function DashboardHome({
  tenantDbName,
  translations,
  userSnapshot,
}: DashboardHomeProps) {
  const t = translations.dashboard;
  const profileT = translations.profile;

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 6,
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant='overline' color='text.secondary'>
            {t.overview}
          </Typography>
          <Typography variant='h3'>{t.welcomeBack}</Typography>
          <Typography color='text.secondary'>{t.workspaceReady}</Typography>
          <Chip
            label={`${t.tenantDatabase}: ${tenantDbName}`}
            color='secondary'
            variant='outlined'
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          />
        </Stack>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        {userSnapshot?.profile ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 6,
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent='space-between'
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Stack direction='row' spacing={1} alignItems='center'>
                  <PersonRoundedIcon color='primary' fontSize='small' />
                  <Typography variant='h6'>{t.profile}</Typography>
                </Stack>
                <Link href='/profile'>
                  <Button
                    size='small'
                    startIcon={<EditRoundedIcon />}
                    variant='outlined'
                  >
                    {profileT.goToProfile}
                  </Button>
                </Link>
              </Stack>
              <Typography color='text.secondary'>
                {t.profileName}:{' '}
                <strong>
                  {userSnapshot.profile.firstName} {userSnapshot.profile.lastName}
                </strong>
              </Typography>
              <Typography color='text.secondary'>
                {t.profileEmail}: <strong>{userSnapshot.profile.email}</strong>
              </Typography>
              <Typography color='text.secondary'>
                {profileT.ageLabel}:{' '}
                <strong>
                  {userSnapshot.profile.age != null
                    ? String(userSnapshot.profile.age)
                    : profileT.emptyValue}
                </strong>
              </Typography>
              <Typography color='text.secondary'>
                {profileT.biologicalSexLabel}:{' '}
                <strong>
                  {getProfileSexLabel(profileT, userSnapshot.profile.gender)}
                </strong>
              </Typography>
              <Typography color='text.secondary'>
                {profileT.activityLevelLabel}:{' '}
                <strong>
                  {getProfileActivityLabel(
                    profileT,
                    userSnapshot.profile.activityLevel,
                  )}
                </strong>
              </Typography>
            </Stack>
          </Paper>
        ) : null}

        {userSnapshot?.settings ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 6,
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction='row' spacing={1} alignItems='center'>
                <SettingsRoundedIcon color='primary' fontSize='small' />
                <Typography variant='h6'>{t.settings}</Typography>
              </Stack>
              <Typography color='text.secondary'>
                {t.settingsLanguage}:{' '}
                <strong>{userSnapshot.settings.language}</strong>
              </Typography>
              <Typography color='text.secondary'>
                {t.settingsTheme}:{' '}
                <strong>
                  {userSnapshot.settings.isDarkMode ? t.themeDark : t.themeLight}
                </strong>
              </Typography>
            </Stack>
          </Paper>
        ) : null}
      </Box>
    </Stack>
  );
}
