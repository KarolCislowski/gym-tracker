'use client';

import type { ReactNode } from 'react';

import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import LibraryAddCheckRoundedIcon from '@mui/icons-material/LibraryAddCheckRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { alpha } from '@mui/material/styles';
import { Box, Paper, Stack, Typography } from '@mui/material';

import { OnboardingReplayButton } from '@/features/onboarding/ui/onboarding-replay-button';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import type { DashboardAnalytics } from '../../application/dashboard-analytics';

interface DashboardOverviewWidgetProps {
  analytics: DashboardAnalytics;
  dailyReportCount: number;
  favoriteExerciseCount: number;
  profileName: string | null;
  translations: TranslationDictionary['dashboard'];
  workoutReportCount: number;
}

/**
 * Summary widget shown at the top of the dashboard.
 * @param props - Component props for the overview widget.
 * @param props.translations - The localized dashboard translation subset.
 * @returns A React element rendering the dashboard overview widget.
 */
export function DashboardOverviewWidget({
  analytics,
  dailyReportCount,
  favoriteExerciseCount,
  profileName,
  translations,
  workoutReportCount,
}: DashboardOverviewWidgetProps) {
  const latestGoalCompliance = analytics.goalCompliance.at(-1);
  const completedGoals = latestGoalCompliance
    ? [
        latestGoalCompliance.sleep,
        latestGoalCompliance.steps,
        latestGoalCompliance.water,
        latestGoalCompliance.protein,
        latestGoalCompliance.cardio,
      ].filter((value) => value === 1).length
    : 0;

  return (
    <Paper
      data-onboarding='dashboard-overview'
      elevation={0}
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        p: { xs: 3, md: 4 },
        border: 1,
        borderColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(theme.palette.primary.main, 0.2),
        borderRadius: 8,
        minHeight: { xs: 300, md: 340 },
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(26,78,59,0.92) 58%, rgba(234,179,8,0.16) 100%)'
            : 'linear-gradient(135deg, #16324f 0%, #1d5c63 46%, #d8a72c 100%)',
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.common.white
            : '#f8fafc',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 22px 56px rgba(2, 6, 23, 0.42)'
            : '0 22px 48px rgba(30, 41, 59, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 'auto auto -72px -48px',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle, rgba(250,204,21,0.28) 0%, rgba(250,204,21,0) 72%)'
              : 'radial-gradient(circle, rgba(254,240,138,0.42) 0%, rgba(254,240,138,0) 72%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -60,
          right: -28,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 72%)'
              : 'radial-gradient(circle, rgba(191,219,254,0.32) 0%, rgba(191,219,254,0) 72%)',
        },
      })}
    >
      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          spacing={1.5}
        >
          <Stack direction='row' spacing={1} alignItems='center'>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha('#ffffff', 0.14)
                    : alpha('#ffffff', 0.16),
                border: '1px solid',
                borderColor: alpha('#ffffff', 0.22),
              }}
            >
              <InsightsRoundedIcon fontSize='small' />
            </Box>
            <Typography variant='overline' sx={{ color: alpha('#ffffff', 0.84) }}>
              {translations.overview}
            </Typography>
          </Stack>
          <OnboardingReplayButton label={translations.replayOnboarding} />
        </Stack>

        <Stack spacing={1.25}>
          {profileName ? (
            <Typography sx={{ color: alpha('#ffffff', 0.78) }} variant='body2'>
              {profileName}
            </Typography>
          ) : null}
          <Typography component='h1' sx={{ maxWidth: 680 }} variant='h2'>
            {translations.welcomeBack}
          </Typography>
          <Typography
            sx={{ color: alpha('#ffffff', 0.84), maxWidth: 720 }}
            variant='body1'
          >
            {translations.workspaceReady}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 1.5,
          }}
        >
          <HeroMetricCard
            icon={<LibraryAddCheckRoundedIcon fontSize='small' />}
            label={translations.goalComplianceChart}
            value={`${completedGoals}/5`}
          />
          <HeroMetricCard
            icon={<LocalFireDepartmentRoundedIcon fontSize='small' />}
            label={translations.dailyReports}
            value={String(dailyReportCount)}
          />
          <HeroMetricCard
            icon={<FitnessCenterRoundedIcon fontSize='small' />}
            label={translations.workoutReports}
            value={String(workoutReportCount)}
          />
          <HeroMetricCard
            icon={<FavoriteRoundedIcon fontSize='small' />}
            label={translations.favoriteExercises}
            value={String(favoriteExerciseCount)}
          />
        </Box>
      </Stack>
    </Paper>
  );
}

function HeroMetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack
      spacing={0.75}
      sx={{
        p: 1.5,
        borderRadius: 4,
        minWidth: 0,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha('#ffffff', 0.08)
            : alpha('#ffffff', 0.12),
        border: '1px solid',
        borderColor: alpha('#ffffff', 0.18),
        backdropFilter: 'blur(12px)',
      }}
    >
      <Stack direction='row' alignItems='center' spacing={0.75}>
        <Box sx={{ color: alpha('#ffffff', 0.84), lineHeight: 0 }}>{icon}</Box>
        <Typography
          sx={{ color: alpha('#ffffff', 0.78) }}
          variant='caption'
        >
          {label}
        </Typography>
      </Stack>
      <Typography variant='h5'>{value}</Typography>
    </Stack>
  );
}
