import Link from 'next/link';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Button, Paper, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import {
  getHealthyHabitsCaloriesLabel,
  getHealthyHabitsMacroLabel,
  getHealthyHabitsProteinLabel,
  getHealthyHabitsWaterLabel,
} from '@/features/healthy-habits/application/healthy-habits-view';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardHealthyHabitsWidgetProps {
  healthyHabits: NonNullable<AuthenticatedUserSnapshot['healthyHabits']>;
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
  translations,
  unitSystem,
}: DashboardHealthyHabitsWidgetProps) {
  const dashboardTranslations = translations.dashboard;
  const habitsTranslations = translations.healthyHabits;

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
            <FavoriteRoundedIcon color='primary' fontSize='small' />
            <Typography component='h2' variant='h6'>
              {dashboardTranslations.healthyHabits}
            </Typography>
          </Stack>
          <Link href='/profile'>
            <Button
              size='small'
              startIcon={<EditRoundedIcon />}
              variant='outlined'
            >
              {habitsTranslations.goToProfile}
            </Button>
          </Link>
        </Stack>
        <Typography color='text.secondary'>
          {habitsTranslations.averageSleepHoursPerDayLabel}:{' '}
          <strong>
            {healthyHabits.averageSleepHoursPerDay != null
              ? `${healthyHabits.averageSleepHoursPerDay} h`
              : habitsTranslations.emptyValue}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.regularSleepScheduleLabel}:{' '}
          <strong>
            {healthyHabits.regularSleepSchedule
              ? habitsTranslations.regularSleepScheduleEnabled
              : habitsTranslations.regularSleepScheduleDisabled}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.stepsPerDayLabel}:{' '}
          <strong>
            {healthyHabits.stepsPerDay != null
              ? String(healthyHabits.stepsPerDay)
              : habitsTranslations.emptyValue}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.waterPerDayLabel}:{' '}
          <strong>
            {getHealthyHabitsWaterLabel(
              habitsTranslations,
              healthyHabits.waterLitersPerDay,
              unitSystem,
            )}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.caloriesPerDayLabel}:{' '}
          <strong>
            {getHealthyHabitsCaloriesLabel(habitsTranslations, healthyHabits)}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.carbsPerDayLabel}:{' '}
          <strong>
            {getHealthyHabitsMacroLabel(
              habitsTranslations,
              healthyHabits.carbsGramsPerDay ?? null,
            )}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.proteinPerDayLabel}:{' '}
          <strong>
            {getHealthyHabitsProteinLabel(
              habitsTranslations,
              healthyHabits.proteinGramsPerDay,
              unitSystem,
            )}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.fatPerDayLabel}:{' '}
          <strong>
            {getHealthyHabitsMacroLabel(
              habitsTranslations,
              healthyHabits.fatGramsPerDay ?? null,
            )}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.strengthWorkoutsPerWeekLabel}:{' '}
          <strong>
            {healthyHabits.strengthWorkoutsPerWeek != null
              ? String(healthyHabits.strengthWorkoutsPerWeek)
              : habitsTranslations.emptyValue}
          </strong>
        </Typography>
        <Typography color='text.secondary'>
          {habitsTranslations.cardioMinutesPerWeekLabel}:{' '}
          <strong>
            {healthyHabits.cardioMinutesPerWeek != null
              ? String(healthyHabits.cardioMinutesPerWeek)
              : habitsTranslations.emptyValue}
          </strong>
        </Typography>
      </Stack>
    </Paper>
  );
}
