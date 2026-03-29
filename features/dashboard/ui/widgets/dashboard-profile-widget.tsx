'use client';

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
import type { DashboardWidgetTone } from '../../application/dashboard-widget-registry';
import { DashboardWidgetShell } from '../layout/dashboard-widget-shell';

interface DashboardProfileWidgetProps {
  profile: NonNullable<AuthenticatedUserSnapshot['profile']>;
  tone?: DashboardWidgetTone;
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
  tone = 'soft',
  unitSystem,
  translations,
}: DashboardProfileWidgetProps) {
  const dashboardTranslations = translations.dashboard;
  const profileTranslations = translations.profile;

  return (
    <DashboardWidgetShell
      density='feature'
      height='tall'
      onboardingId='dashboard-profile'
      tone={tone}
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
          <Tooltip title={profileTranslations.goToProfile}>
            <IconButton
              aria-label={profileTranslations.goToProfile}
              component={Link}
              href='/profile'
              size='small'
            >
              <EditRoundedIcon fontSize='small' />
            </IconButton>
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
      sx={(theme) => ({
        p: 1.5,
        border: 1,
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(148, 163, 184, 0.18)'
            : 'rgba(148, 163, 184, 0.16)',
        borderRadius: 3.5,
        minWidth: 0,
        bgcolor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(255, 255, 255, 0.72)',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))',
        boxShadow:
          theme.palette.mode === 'dark'
            ? 'none'
            : '0 8px 20px rgba(148, 163, 184, 0.06)',
      })}
    >
      <Typography
        color='text.secondary'
        sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
        variant='caption'
      >
        {label}
      </Typography>
      <Typography
        sx={{ wordBreak: 'break-word', lineHeight: 1.3 }}
        variant='subtitle2'
      >
        {value}
      </Typography>
    </Stack>
  );
}
