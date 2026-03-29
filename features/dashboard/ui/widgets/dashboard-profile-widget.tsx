import Link from 'next/link';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import {
  calculateAgeFromBirthDate,
  getProfileActivityLabel,
  getProfileHeightLabel,
  getProfileLocationLabel,
  getProfileSexLabel,
} from '@/features/profile/application/profile-view';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { DashboardWidgetShell } from '../layout/dashboard-widget-shell';

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
    <DashboardWidgetShell density='feature' onboardingId='dashboard-profile'>
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
          <Tooltip title={profileTranslations.goToProfile}>
            <Link aria-label={profileTranslations.goToProfile} href='/profile'>
              <IconButton size='small'>
                <EditRoundedIcon fontSize='small' />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 1.25,
          }}
        >
          <ProfileDataTile
            label={dashboardTranslations.profileName}
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <ProfileDataTile
            label={dashboardTranslations.profileEmail}
            value={profile.email}
          />
          <ProfileDataTile
            label={profileTranslations.locationLabel}
            value={getProfileLocationLabel(profileTranslations, profile.location)}
          />
          <ProfileDataTile
            label={profileTranslations.ageLabel}
            value={String(
              calculateAgeFromBirthDate(profile.birthDate) ??
                profileTranslations.emptyValue,
            )}
          />
          <ProfileDataTile
            label={profileTranslations.heightLabel}
            value={getProfileHeightLabel(
              profileTranslations,
              profile.heightCm,
              unitSystem,
            )}
          />
          <ProfileDataTile
            label={profileTranslations.biologicalSexLabel}
            value={getProfileSexLabel(profileTranslations, profile.gender)}
          />
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <ProfileDataTile
              label={profileTranslations.activityLevelLabel}
              value={getProfileActivityLabel(
                profileTranslations,
                profile.activityLevel,
              )}
            />
          </Box>
        </Box>
      </Stack>
    </DashboardWidgetShell>
  );
}

function ProfileDataTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack
      spacing={0.35}
      sx={{
        p: 1.25,
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        minWidth: 0,
        bgcolor: 'background.default',
      }}
    >
      <Typography color='text.secondary' variant='caption'>
        {label}
      </Typography>
      <Typography sx={{ wordBreak: 'break-word' }} variant='body2'>
        {value}
      </Typography>
    </Stack>
  );
}
