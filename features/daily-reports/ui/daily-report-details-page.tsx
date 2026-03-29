import { Alert, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { calculateCaloriesFromMacros } from '@/shared/nutrition/application/macro-calculations';
import { AppCard } from '@/shared/ui/app-card';
import { DeleteConfirmationButton } from '@/shared/ui/delete-confirmation-button';
import { convertHydrationFromMetricLiters } from '@/shared/units/application/unit-conversion';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

import type { DailyReportDetails } from '../domain/daily-report.types';
import { deleteDailyReportAction } from '../infrastructure/daily-report.actions';
import { DailyReportEditor } from './daily-report-editor';

interface DailyReportDetailsPageProps {
  error?: string;
  report: DailyReportDetails | null;
  status?: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Server-rendered details page for a single daily report with an on-demand edit form.
 * @param props - Component props for the daily report details page.
 * @param props.report - Detailed daily report snapshot or `null` when missing.
 * @param props.status - Optional success status returned by the edit action.
 * @param props.error - Optional error code returned by the edit action.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - Authenticated user snapshot used for privacy-aware rendering.
 * @returns A React element rendering report details or a not-found state.
 */
export function DailyReportDetailsPage({
  error,
  report,
  status,
  translations,
  userSnapshot,
}: DailyReportDetailsPageProps) {
  const t = translations.dailyReports;
  const feedback = status === 'daily-report-updated'
    ? { severity: 'success' as const, message: t.reportUpdated }
    : error
      ? { severity: 'error' as const, message: t.reportError }
      : null;
  const unitSystem = userSnapshot?.settings?.unitSystem ?? 'metric';
  const goalCalories = calculateCaloriesFromMacros({
    proteinGrams: report?.goalsSnapshot.proteinGramsPerDay,
    carbsGrams: report?.goalsSnapshot.carbsGramsPerDay,
    fatGrams: report?.goalsSnapshot.fatGramsPerDay,
  });
  const actualCalories = calculateCaloriesFromMacros({
    proteinGrams: report?.actuals.proteinGrams,
    carbsGrams: report?.actuals.carbsGrams,
    fatGrams: report?.actuals.fatGrams,
  });

  if (!report) {
    return (
      <Stack spacing={2}>
        <Typography component='h1' variant='h3'>
          {t.notFoundTitle}
        </Typography>
        <Typography color='text.secondary'>{t.notFoundDescription}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Stack
          alignItems='center'
          direction='row'
          justifyContent='space-between'
          spacing={1.5}
        >
          <Typography component='h1' variant='h3'>
            {t.detailsTitle}
          </Typography>
          <DeleteConfirmationButton
            action={deleteDailyReportAction}
            ariaLabel={`${t.deleteReportLabel}: ${new Date(report.reportDate).toLocaleDateString()}`}
            cancelLabel={translations.profile.cancelEditing}
            confirmLabel={t.confirmDeleteLabel}
            description={t.deleteReportDescription}
            hiddenFields={{ reportId: report.id }}
            title={t.deleteReportTitle}
            tooltipLabel={t.deleteReportLabel}
          />
        </Stack>
        <Typography color='text.secondary'>
          {new Date(report.reportDate).toLocaleDateString()}
        </Typography>
        <Typography color='text.secondary'>{t.detailsDescription}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <DailyReportEditor
        initialReport={report}
        initiallyOpen={Boolean(error)}
        translations={translations}
        userSnapshot={userSnapshot}
      />

      <Stack
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
          alignItems: 'start',
        }}
      >
        <DetailsSection
          rows={[
            [translations.dailyReports.reportDateLabel, new Date(report.reportDate).toLocaleDateString()],
          ]}
          title={t.summaryTitle}
        />
        <DetailsSection
          rows={[
            [translations.healthyHabits.averageSleepHoursPerDayLabel, formatNumber(report.goalsSnapshot.averageSleepHoursPerDay, 'h', translations.profile.emptyValue)],
            [translations.healthyHabits.regularSleepScheduleLabel, formatBoolean(report.goalsSnapshot.regularSleepSchedule, translations)],
            [translations.healthyHabits.stepsPerDayLabel, formatNumber(report.goalsSnapshot.stepsPerDay, '', translations.profile.emptyValue)],
            [
              unitSystem === 'metric'
                ? translations.healthyHabits.waterLitersPerDayLabel
                : translations.healthyHabits.waterFluidOuncesPerDayLabel,
              formatHydration(report.goalsSnapshot.waterLitersPerDay, unitSystem, translations.profile.emptyValue),
            ],
            [translations.healthyHabits.caloriesPerDayLabel, formatNumber(goalCalories, 'kcal', translations.profile.emptyValue)],
            [translations.healthyHabits.carbsPerDayLabel, formatNumber(report.goalsSnapshot.carbsGramsPerDay ?? null, 'g', translations.profile.emptyValue)],
            [translations.healthyHabits.proteinPerDayLabel, formatNumber(report.goalsSnapshot.proteinGramsPerDay, 'g', translations.profile.emptyValue)],
            [translations.healthyHabits.fatPerDayLabel, formatNumber(report.goalsSnapshot.fatGramsPerDay ?? null, 'g', translations.profile.emptyValue)],
            [translations.healthyHabits.cardioMinutesPerWeekLabel, formatNumber(report.goalsSnapshot.cardioMinutesPerWeek, 'min', translations.profile.emptyValue)],
          ]}
          title={t.goalsSectionTitle}
        />
        <DetailsSection
          rows={[
            [t.sleepHoursLabel, formatNumber(report.actuals.sleepHours, 'h', translations.profile.emptyValue)],
            [t.sleepScheduleKeptLabel, formatBoolean(report.actuals.sleepScheduleKept, translations)],
            [t.stepsLabel, formatNumber(report.actuals.steps, '', translations.profile.emptyValue)],
            [
              unitSystem === 'metric' ? t.waterLitersLabel : t.waterFluidOuncesLabel,
              formatHydration(report.actuals.waterLiters, unitSystem, translations.profile.emptyValue),
            ],
            [t.caloriesLabel, formatNumber(actualCalories, 'kcal', translations.profile.emptyValue)],
            [t.carbsGramsLabel, formatNumber(report.actuals.carbsGrams ?? null, 'g', translations.profile.emptyValue)],
            [t.proteinGramsLabel, formatNumber(report.actuals.proteinGrams, 'g', translations.profile.emptyValue)],
            [t.fatGramsLabel, formatNumber(report.actuals.fatGrams ?? null, 'g', translations.profile.emptyValue)],
            [t.strengthWorkoutDoneLabel, formatBoolean(report.actuals.strengthWorkoutDone, translations)],
            [t.cardioMinutesLabel, formatNumber(report.actuals.cardioMinutes, 'min', translations.profile.emptyValue)],
          ]}
          title={t.actualsSectionTitle}
        />
        <DetailsSection
          rows={[
            [t.columnSleepGoal, formatBoolean(report.completion.sleepGoalMet, translations)],
            [translations.healthyHabits.stepsPerDayLabel, formatBoolean(report.completion.stepsGoalMet, translations)],
            [translations.healthyHabits.waterLitersPerDayLabel, formatBoolean(report.completion.waterGoalMet, translations)],
            [translations.healthyHabits.caloriesPerDayLabel, formatBoolean(report.completion.caloriesGoalMet ?? null, translations)],
            [translations.healthyHabits.carbsPerDayLabel, formatBoolean(report.completion.carbsGoalMet ?? null, translations)],
            [translations.healthyHabits.proteinPerDayLabel, formatBoolean(report.completion.proteinGoalMet, translations)],
            [translations.healthyHabits.fatPerDayLabel, formatBoolean(report.completion.fatGoalMet ?? null, translations)],
            [translations.healthyHabits.cardioMinutesPerWeekLabel, formatBoolean(report.completion.cardioGoalMet, translations)],
          ]}
          title={t.completionSectionTitle}
        />
        <DetailsSection
          rows={[
            [t.columnMood, formatScore(report.wellbeing.mood, translations.profile.emptyValue)],
            [t.columnEnergy, formatScore(report.wellbeing.energy, translations.profile.emptyValue)],
            [t.columnStress, formatScore(report.wellbeing.stress, translations.profile.emptyValue)],
            [t.sorenessLabel, formatScore(report.wellbeing.soreness, translations.profile.emptyValue)],
            ...(userSnapshot?.settings?.trackLibido
              ? [[t.libidoLabel, formatScore(report.wellbeing.libido, translations.profile.emptyValue)] as const]
              : []),
            [t.motivationLabel, formatScore(report.wellbeing.motivation, translations.profile.emptyValue)],
            [t.columnRecovery, formatScore(report.wellbeing.recovery, translations.profile.emptyValue)],
          ]}
          title={t.wellbeingSectionTitle}
        />
        <DetailsSection
          rows={[
            [t.bodyWeightLabel, formatNumber(report.body.bodyWeightKg, 'kg', translations.profile.emptyValue)],
            [t.restingHeartRateLabel, formatNumber(report.body.restingHeartRate, '', translations.profile.emptyValue)],
          ]}
          title={t.bodySectionTitle}
        />
        <DetailsSection
          rows={[
            ...(userSnapshot?.settings?.trackMenstrualCycle
              ? [[t.menstruationPhaseLabel, formatMenstruationPhase(report.dayContext.menstruationPhase, t, translations.profile.emptyValue)] as const]
              : []),
            [t.illnessLabel, formatBoolean(report.dayContext.illness, translations)],
            [t.notesLabel, report.dayContext.notes ?? translations.profile.emptyValue],
          ]}
          title={t.contextSectionTitle}
        />
      </Stack>
    </Stack>
  );
}

function DetailsSection({
  rows,
  title,
}: {
  rows: readonly (readonly [string, string])[];
  title: string;
}) {
  return (
    <AppCard padding='md' radius='lg' tone='standard'>
      <Stack spacing={1.5}>
        <Typography component='h2' variant='h6'>
          {title}
        </Typography>
        {rows.map(([label, value]) => (
          <Stack
            direction='row'
            justifyContent='space-between'
            key={label}
            spacing={2}
            sx={{ py: 0.75, borderBottom: 1, borderColor: 'divider' }}
          >
            <Typography color='text.secondary' variant='body2'>
              {label}
            </Typography>
            <Typography sx={{ textAlign: 'right' }} variant='body2'>
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </AppCard>
  );
}

function formatBoolean(
  value: boolean | null,
  translations: TranslationDictionary,
): string {
  if (value == null) {
    return translations.profile.emptyValue;
  }

  return value ? translations.exercises.yesLabel : translations.exercises.noLabel;
}

function formatNumber(
  value: number | null,
  suffix: string,
  emptyValue: string,
): string {
  if (value == null) {
    return emptyValue;
  }

  return suffix ? `${value} ${suffix}` : String(value);
}

function formatScore(value: number | null, emptyValue: string): string {
  return value == null ? emptyValue : `${value}/5`;
}

function formatMenstruationPhase(
  value: DailyReportDetails['dayContext']['menstruationPhase'],
  translations: TranslationDictionary['dailyReports'],
  emptyValue: string,
): string {
  switch (value) {
    case 'menstruation':
      return translations.menstruationPhaseMenstruation;
    case 'follicular':
      return translations.menstruationPhaseFollicular;
    case 'ovulation':
      return translations.menstruationPhaseOvulation;
    case 'luteal':
      return translations.menstruationPhaseLuteal;
    case 'unknown':
      return translations.menstruationPhaseUnknown;
    default:
      return emptyValue;
  }
}

function formatHydration(
  liters: number | null,
  unitSystem: UnitSystem,
  emptyValue: string,
): string {
  if (liters == null) {
    return emptyValue;
  }

  const converted = convertHydrationFromMetricLiters(liters, unitSystem);

  return `${converted.value} ${converted.unit}`;
}
