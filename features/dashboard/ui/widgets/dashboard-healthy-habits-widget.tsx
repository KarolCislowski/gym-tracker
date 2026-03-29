'use client';

import Link from 'next/link';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import {
  getHealthyHabitsCaloriesLabel,
  getHealthyHabitsMacroLabel,
  getHealthyHabitsProteinLabel,
  getHealthyHabitsWaterLabel,
} from '@/features/healthy-habits/application/healthy-habits-view';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import type { DashboardWidgetTone } from '../../application/dashboard-widget-registry';
import { DashboardWidgetShell } from '../layout/dashboard-widget-shell';

interface DashboardHealthyHabitsWidgetProps {
  healthyHabits: NonNullable<AuthenticatedUserSnapshot['healthyHabits']>;
  tone?: DashboardWidgetTone;
  translations: TranslationDictionary;
  unitSystem: NonNullable<AuthenticatedUserSnapshot['settings']>['unitSystem'];
}

/**
 * Healthy habits widget displaying the current user's goals snapshot.
 * @param props - Component props for the healthy habits widget.
 * @param props.healthyHabits - The authenticated user's tenant healthy habits snapshot.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.unitSystem - Preferred measurement system used for presentation.
 * @returns A React element rendering the dashboard healthy habits widget.
 */
export function DashboardHealthyHabitsWidget({
  healthyHabits,
  tone = 'accent',
  translations,
  unitSystem,
}: DashboardHealthyHabitsWidgetProps) {
  const dashboardTranslations = translations.dashboard;
  const habitsTranslations = translations.healthyHabits;

  return (
    <DashboardWidgetShell
      density='feature'
      height='regular'
      onboardingId='dashboard-healthy-habits'
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
            <FavoriteRoundedIcon color='primary' fontSize='small' />
            <Typography component='h2' variant='h6'>
              {dashboardTranslations.healthyHabits}
            </Typography>
          </Stack>
          <Tooltip title={habitsTranslations.goToProfile}>
            <Link aria-label={habitsTranslations.goToProfile} href='/profile'>
              <IconButton size='small'>
                <EditRoundedIcon fontSize='small' />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.25,
          }}
        >
          <HealthyHabitsDataTile
            label={habitsTranslations.averageSleepHoursPerDayLabel}
            value={
              healthyHabits.averageSleepHoursPerDay != null
                ? `${healthyHabits.averageSleepHoursPerDay} h`
                : habitsTranslations.emptyValue
            }
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.regularSleepScheduleLabel}
            value={
              healthyHabits.regularSleepSchedule
                ? habitsTranslations.regularSleepScheduleEnabled
                : habitsTranslations.regularSleepScheduleDisabled
            }
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.stepsPerDayLabel}
            value={
              healthyHabits.stepsPerDay != null
                ? String(healthyHabits.stepsPerDay)
                : habitsTranslations.emptyValue
            }
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.waterPerDayLabel}
            value={getHealthyHabitsWaterLabel(
              habitsTranslations,
              healthyHabits.waterLitersPerDay,
              unitSystem,
            )}
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.caloriesPerDayLabel}
            value={getHealthyHabitsCaloriesLabel(
              habitsTranslations,
              healthyHabits,
            )}
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.carbsPerDayLabel}
            value={getHealthyHabitsMacroLabel(
              habitsTranslations,
              healthyHabits.carbsGramsPerDay ?? null,
            )}
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.proteinPerDayLabel}
            value={getHealthyHabitsProteinLabel(
              habitsTranslations,
              healthyHabits.proteinGramsPerDay,
              unitSystem,
            )}
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.fatPerDayLabel}
            value={getHealthyHabitsMacroLabel(
              habitsTranslations,
              healthyHabits.fatGramsPerDay ?? null,
            )}
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.strengthWorkoutsPerWeekLabel}
            value={
              healthyHabits.strengthWorkoutsPerWeek != null
                ? String(healthyHabits.strengthWorkoutsPerWeek)
                : habitsTranslations.emptyValue
            }
          />
          <HealthyHabitsDataTile
            label={habitsTranslations.cardioMinutesPerWeekLabel}
            value={
              healthyHabits.cardioMinutesPerWeek != null
                ? String(healthyHabits.cardioMinutesPerWeek)
                : habitsTranslations.emptyValue
            }
          />
        </Box>
      </Stack>
    </DashboardWidgetShell>
  );
}

function HealthyHabitsDataTile({
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
        p: 1.4,
        border: 1,
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(125, 211, 252, 0.16)'
            : 'rgba(59, 130, 246, 0.18)',
        borderRadius: 3.5,
        minWidth: 0,
        bgcolor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(255, 255, 255, 0.62)',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(239,246,255,0.82))',
        boxShadow:
          theme.palette.mode === 'dark'
            ? 'none'
            : '0 10px 24px rgba(59, 130, 246, 0.08)',
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
