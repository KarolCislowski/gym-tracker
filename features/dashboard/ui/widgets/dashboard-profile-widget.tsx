import Link from 'next/link';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Button, Paper, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import {
  calculateAgeFromBirthDate,
  getProfileActivityLabel,
  getProfileHeightLabel,
  getProfileLocationLabel,
  getProfileSexLabel,
} from '@/features/profile/application/profile-view';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardProfileWidgetProps {
  profile: NonNullable<AuthenticatedUserSnapshot['profile']>;
  unitSystem: NonNullable<AuthenticatedUserSnapshot['settings']>['unitSystem'];
  translations: TranslationDictionary;
}

/**
 * Profile widget displaying the current user's profile snapshot.
 * @param props - Component props for the profile widget.
 * @param props.profile - The authenticated user's tenant profile snapshot.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the dashboard profile widget.
 */
export function DashboardProfileWidget({
  profile,
  unitSystem,
  translations,
}: DashboardProfileWidgetProps) {
  const dashboardTranslations = translations.dashboard;
  const profileTranslations = translations.profile;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
        minWidth: 0,
      }}
    >
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction='row' spacing={1} alignItems='center'>
            <PersonRoundedIcon color='primary' fontSize='small' />
            <Typography component='h2' variant='h6'>
              {dashboardTranslations.profile}
            </Typography>
          </Stack>
          <Link href='/profile'>
            <Button
              size='small'
              startIcon={<EditRoundedIcon />}
              variant='outlined'
            >
              {profileTranslations.goToProfile}
            </Button>
          </Link>
        </Stack>
        <Typography color='text.secondary'>
          {dashboardTranslations.profileName}: <strong>{profile.firstName} {profile.lastName}</strong>
        </Typography>
        <Typography color='text.secondary'>
          {dashboardTranslations.profileEmail}: <strong>{profile.email}</strong>
        </Typography>
        <Typography color='text.secondary'>
          {profileTranslations.locationLabel}:{' '}
          <strong>{getProfileLocationLabel(profileTranslations, profile.location)}</strong>
        </Typography>
        <Typography color='text.secondary'>
          {profileTranslations.ageLabel}:{' '}
          <strong>
            {calculateAgeFromBirthDate(profile.birthDate) ??
              profileTranslations.emptyValue}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {profileTranslations.heightLabel}:{' '}
          <strong>{getProfileHeightLabel(profileTranslations, profile.heightCm, unitSystem)}</strong>
        </Typography>
        <Typography color='text.secondary'>
          {profileTranslations.biologicalSexLabel}:{' '}
          <strong>{getProfileSexLabel(profileTranslations, profile.gender)}</strong>
        </Typography>
        <Typography color='text.secondary'>
          {profileTranslations.activityLevelLabel}:{' '}
          <strong>{getProfileActivityLabel(profileTranslations, profile.activityLevel)}</strong>
        </Typography>
      </Stack>
    </Paper>
  );
}
