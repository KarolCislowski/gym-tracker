import Link from 'next/link';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardHomeProps {
  tenantDbName: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

function getSexLabel(
  t: TranslationDictionary['profile'],
  value: AuthenticatedUserSnapshot['profile'] extends infer P
    ? P extends { gender: infer G }
      ? G
      : never
    : never,
): string {
  switch (value) {
    case 'female':
      return t.sexFemale;
    case 'male':
      return t.sexMale;
    case 'other':
      return t.sexOther;
    case 'prefer_not_to_say':
      return t.sexPreferNotToSay;
    default:
      return t.emptyValue;
  }
}

function getActivityLabel(
  t: TranslationDictionary['profile'],
  value: AuthenticatedUserSnapshot['profile'] extends infer P
    ? P extends { activityLevel: infer A }
      ? A
      : never
    : never,
): string {
  switch (value) {
    case 'sedentary':
      return t.activitySedentary;
    case 'lightly_active':
      return t.activityLightlyActive;
    case 'moderately_active':
      return t.activityModeratelyActive;
    case 'very_active':
      return t.activityVeryActive;
    case 'extra_active':
      return t.activityExtraActive;
    default:
      return t.emptyValue;
  }
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
                <strong>{getSexLabel(profileT, userSnapshot.profile.gender)}</strong>
              </Typography>
              <Typography color='text.secondary'>
                {profileT.activityLevelLabel}:{' '}
                <strong>
                  {getActivityLabel(profileT, userSnapshot.profile.activityLevel)}
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
