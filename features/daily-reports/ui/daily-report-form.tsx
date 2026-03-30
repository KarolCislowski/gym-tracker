'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { calculateCaloriesFromMacros } from '@/shared/nutrition/application/macro-calculations';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';
import { useUnsavedChangesWarning } from '@/shared/ui/use-unsaved-changes-warning';
import {
  convertHydrationFromMetricLiters,
  convertHydrationToMetricLiters,
} from '@/shared/units/application/unit-conversion';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

import type {
  DailyReportDetails,
  MenstruationPhase,
} from '../domain/daily-report.types';
import { createDailyReportAction } from '../infrastructure/daily-report.actions';

interface DailyReportFormProps {
  formAction?: (formData: FormData) => Promise<void>;
  initialReport?: DailyReportDetails | null;
  onCancel?: () => void;
  reportId?: string;
  submitLabel?: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

type DailyScoreDraft = '' | '1' | '2' | '3' | '4' | '5';

interface DailyWellbeingDraft {
  mood: DailyScoreDraft;
  energy: DailyScoreDraft;
  stress: DailyScoreDraft;
  soreness: DailyScoreDraft;
  libido: DailyScoreDraft;
  motivation: DailyScoreDraft;
  recovery: DailyScoreDraft;
}

/**
 * Mobile-first daily check-in form for goals completion, wellbeing, and day context.
 * @param props - Component props for the daily report form.
 * @param props.translations - Full translation dictionary for localized labels.
 * @param props.userSnapshot - Authenticated user snapshot used to display current healthy-habits targets.
 * @returns A React element rendering the daily report form.
 */
export function DailyReportForm({
  formAction = createDailyReportAction,
  initialReport,
  onCancel,
  reportId,
  submitLabel,
  translations,
  userSnapshot,
}: DailyReportFormProps) {
  const t = translations.dailyReports;
  const { formRef, markSubmitted } = useUnsavedChangesWarning({
    message: translations.common.unsavedChangesWarning,
  });
  const habitsT = translations.healthyHabits;
  const profileT = translations.profile;
  const yesNoT = translations.exercises;
  const goals = userSnapshot?.healthyHabits;
  const settings = userSnapshot?.settings;
  const unitSystem = settings?.unitSystem ?? 'metric';
  const waterLabel =
    unitSystem === 'metric' ? t.waterLitersLabel : t.waterFluidOuncesLabel;
  const goalsWaterLabel =
    unitSystem === 'metric'
      ? habitsT.waterLitersPerDayLabel
      : habitsT.waterFluidOuncesPerDayLabel;

  const [reportDate, setReportDate] = useState(
    initialReport ? formatDateInput(new Date(initialReport.reportDate)) : formatDateInput(new Date()),
  );
  const [sleepHours, setSleepHours] = useState(
    formatInitialNumber(initialReport?.actuals.sleepHours),
  );
  const [sleepScheduleKept, setSleepScheduleKept] = useState(
    initialReport?.actuals.sleepScheduleKept ?? false,
  );
  const [steps, setSteps] = useState(formatInitialNumber(initialReport?.actuals.steps));
  const [waterAmount, setWaterAmount] = useState(
    formatInitialHydration(initialReport?.actuals.waterLiters, unitSystem),
  );
  const [carbsGrams, setCarbsGrams] = useState(
    formatInitialNumber(initialReport?.actuals.carbsGrams),
  );
  const [proteinGrams, setProteinGrams] = useState(
    formatInitialNumber(initialReport?.actuals.proteinGrams),
  );
  const [fatGrams, setFatGrams] = useState(
    formatInitialNumber(initialReport?.actuals.fatGrams),
  );
  const [strengthWorkoutDone, setStrengthWorkoutDone] = useState(
    initialReport?.actuals.strengthWorkoutDone ?? false,
  );
  const [cardioMinutes, setCardioMinutes] = useState(
    formatInitialNumber(initialReport?.actuals.cardioMinutes),
  );
  const [bodyWeightKg, setBodyWeightKg] = useState(
    formatInitialNumber(initialReport?.body.bodyWeightKg),
  );
  const [restingHeartRate, setRestingHeartRate] = useState(
    formatInitialNumber(initialReport?.body.restingHeartRate),
  );
  const [menstruationPhase, setMenstruationPhase] =
    useState<MenstruationPhase | ''>(initialReport?.dayContext.menstruationPhase ?? '');
  const [illness, setIllness] = useState(initialReport?.dayContext.illness ?? false);
  const [notes, setNotes] = useState(initialReport?.dayContext.notes ?? '');
  const [wellbeing, setWellbeing] = useState<DailyWellbeingDraft>({
    mood: formatInitialScore(initialReport?.wellbeing.mood),
    energy: formatInitialScore(initialReport?.wellbeing.energy),
    stress: formatInitialScore(initialReport?.wellbeing.stress),
    soreness: formatInitialScore(initialReport?.wellbeing.soreness),
    libido: formatInitialScore(initialReport?.wellbeing.libido),
    motivation: formatInitialScore(initialReport?.wellbeing.motivation),
    recovery: formatInitialScore(initialReport?.wellbeing.recovery),
  });
  const calculatedGoalCalories = useMemo(
    () =>
      calculateCaloriesFromMacros({
        proteinGrams: goals?.proteinGramsPerDay,
        carbsGrams: goals?.carbsGramsPerDay,
        fatGrams: goals?.fatGramsPerDay,
      }),
    [goals?.carbsGramsPerDay, goals?.fatGramsPerDay, goals?.proteinGramsPerDay],
  );
  const calculatedActualCalories = useMemo(
    () =>
      calculateCaloriesFromMacros({
        proteinGrams: normalizeOptionalNumber(proteinGrams),
        carbsGrams: normalizeOptionalNumber(carbsGrams),
        fatGrams: normalizeOptionalNumber(fatGrams),
      }),
    [carbsGrams, fatGrams, proteinGrams],
  );
  const reportDateIso = useMemo(() => resolveReportDateIso(reportDate), [reportDate]);

  function resetFormDraft() {
    setReportDate(
      initialReport ? formatDateInput(new Date(initialReport.reportDate)) : formatDateInput(new Date()),
    );
    setSleepHours(formatInitialNumber(initialReport?.actuals.sleepHours));
    setSleepScheduleKept(initialReport?.actuals.sleepScheduleKept ?? false);
    setSteps(formatInitialNumber(initialReport?.actuals.steps));
    setWaterAmount(formatInitialHydration(initialReport?.actuals.waterLiters, unitSystem));
    setCarbsGrams(formatInitialNumber(initialReport?.actuals.carbsGrams));
    setProteinGrams(formatInitialNumber(initialReport?.actuals.proteinGrams));
    setFatGrams(formatInitialNumber(initialReport?.actuals.fatGrams));
    setStrengthWorkoutDone(initialReport?.actuals.strengthWorkoutDone ?? false);
    setCardioMinutes(formatInitialNumber(initialReport?.actuals.cardioMinutes));
    setBodyWeightKg(formatInitialNumber(initialReport?.body.bodyWeightKg));
    setRestingHeartRate(formatInitialNumber(initialReport?.body.restingHeartRate));
    setMenstruationPhase(initialReport?.dayContext.menstruationPhase ?? '');
    setIllness(initialReport?.dayContext.illness ?? false);
    setNotes(initialReport?.dayContext.notes ?? '');
    setWellbeing({
      mood: formatInitialScore(initialReport?.wellbeing.mood),
      energy: formatInitialScore(initialReport?.wellbeing.energy),
      stress: formatInitialScore(initialReport?.wellbeing.stress),
      soreness: formatInitialScore(initialReport?.wellbeing.soreness),
      libido: formatInitialScore(initialReport?.wellbeing.libido),
      motivation: formatInitialScore(initialReport?.wellbeing.motivation),
      recovery: formatInitialScore(initialReport?.wellbeing.recovery),
    });
  }

  const completion = useMemo(
    () => ({
      sleepGoalMet: resolveSleepGoalMet(goals, sleepHours, sleepScheduleKept),
      stepsGoalMet: resolveNumericGoalMet(goals?.stepsPerDay ?? null, steps),
      waterGoalMet: resolveNumericGoalMet(
        goals?.waterLitersPerDay ?? null,
        resolveWaterLiters(waterAmount, unitSystem),
      ),
      caloriesGoalMet: resolveNumericGoalMet(
        calculatedGoalCalories,
        calculatedActualCalories,
      ),
      carbsGoalMet: resolveNumericGoalMet(
        goals?.carbsGramsPerDay ?? null,
        carbsGrams,
      ),
      proteinGoalMet: resolveNumericGoalMet(
        goals?.proteinGramsPerDay ?? null,
        proteinGrams,
      ),
      fatGoalMet: resolveNumericGoalMet(goals?.fatGramsPerDay ?? null, fatGrams),
      cardioGoalMet: resolveNumericGoalMet(
        goals?.cardioMinutesPerWeek != null
          ? goals.cardioMinutesPerWeek / 7
          : null,
        cardioMinutes,
      ),
    }),
    [
      calculatedActualCalories,
      calculatedGoalCalories,
      cardioMinutes,
      carbsGrams,
      fatGrams,
      goals,
      proteinGrams,
      sleepHours,
      sleepScheduleKept,
      steps,
      waterAmount,
      unitSystem,
    ],
  );

  const payload = useMemo(
    () =>
      reportDateIso
        ? JSON.stringify({
        reportDate: reportDateIso,
        actuals: {
          sleepHours: normalizeOptionalNumber(sleepHours),
          sleepScheduleKept:
            goals?.regularSleepSchedule === true ? sleepScheduleKept : null,
          steps: normalizeOptionalNumber(steps),
          waterLiters: resolveWaterLiters(waterAmount, unitSystem),
          calories: calculatedActualCalories,
          carbsGrams: normalizeOptionalNumber(carbsGrams),
          proteinGrams: normalizeOptionalNumber(proteinGrams),
          fatGrams: normalizeOptionalNumber(fatGrams),
          strengthWorkoutDone,
          cardioMinutes: normalizeOptionalNumber(cardioMinutes),
        },
        wellbeing: {
          mood: normalizeOptionalScore(wellbeing.mood),
          energy: normalizeOptionalScore(wellbeing.energy),
          stress: normalizeOptionalScore(wellbeing.stress),
          soreness: normalizeOptionalScore(wellbeing.soreness),
          libido: settings?.trackLibido
            ? normalizeOptionalScore(wellbeing.libido)
            : null,
          motivation: normalizeOptionalScore(wellbeing.motivation),
          recovery: normalizeOptionalScore(wellbeing.recovery),
        },
        body: {
          bodyWeightKg: normalizeOptionalNumber(bodyWeightKg),
          restingHeartRate: normalizeOptionalNumber(restingHeartRate),
        },
        dayContext: {
          weatherSnapshot: null,
          menstruationPhase:
            settings?.trackMenstrualCycle && menstruationPhase
              ? menstruationPhase
              : null,
          illness,
          notes: notes.trim() || null,
        },
        completion,
      })
        : '',
    [
      bodyWeightKg,
      calculatedActualCalories,
      cardioMinutes,
      completion,
      carbsGrams,
      fatGrams,
      goals?.regularSleepSchedule,
      illness,
      menstruationPhase,
      notes,
      proteinGrams,
      reportDate,
      reportDateIso,
      restingHeartRate,
      sleepHours,
      sleepScheduleKept,
      steps,
      strengthWorkoutDone,
      waterAmount,
      wellbeing,
      settings?.trackLibido,
      settings?.trackMenstrualCycle,
      unitSystem,
    ],
  );

  return (
    <Stack
      component='form'
      action={formAction}
      onSubmitCapture={markSubmitted}
      ref={formRef}
      spacing={2.5}
    >
      <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={2}>
          <Typography component='h2' variant='h6'>
            {t.addReportTitle}
          </Typography>
          <Typography color='text.secondary'>{t.addReportDescription}</Typography>
          <TextField
            label={t.reportDateLabel}
            onChange={(event) => setReportDate(event.target.value)}
            required
            slotProps={{ inputLabel: { shrink: true } }}
            type='date'
            value={reportDate}
          />
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={1.5}>
          <Typography component='h2' variant='h6'>
            {t.goalsSnapshotTitle}
          </Typography>
          <Stack
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <GoalSnapshotRow
              label={habitsT.averageSleepHoursPerDayLabel}
              value={formatGoalValue(goals?.averageSleepHoursPerDay, 'h', profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.regularSleepScheduleLabel}
              value={formatBooleanValue(goals?.regularSleepSchedule, yesNoT, profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.stepsPerDayLabel}
              value={formatGoalValue(goals?.stepsPerDay, '', profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={goalsWaterLabel}
              value={formatHydrationValue(goals?.waterLitersPerDay, unitSystem, profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.caloriesPerDayLabel}
              value={formatGoalValue(calculatedGoalCalories, 'kcal', profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.carbsPerDayLabel}
              value={formatGoalValue(goals?.carbsGramsPerDay, 'g', profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.proteinPerDayLabel}
              value={formatGoalValue(goals?.proteinGramsPerDay, 'g', profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.fatPerDayLabel}
              value={formatGoalValue(goals?.fatGramsPerDay, 'g', profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.cardioMinutesPerWeekLabel}
              value={formatGoalValue(goals?.cardioMinutesPerWeek, '', profileT.emptyValue)}
            />
          </Stack>
        </Stack>
      </Paper>

      <FormSectionCard title={t.actualsTitle}>
        <Stack spacing={1.5}>
          <NumberField
            label={t.sleepHoursLabel}
            onChange={setSleepHours}
            value={sleepHours}
          />
          {goals?.regularSleepSchedule === true ? (
            <SwitchField
              checked={sleepScheduleKept}
              label={t.sleepScheduleKeptLabel}
              onChange={setSleepScheduleKept}
            />
          ) : null}
          <NumberField label={t.stepsLabel} onChange={setSteps} value={steps} />
          <NumberField
            label={waterLabel}
            onChange={setWaterAmount}
            value={waterAmount}
          />
          <TextField
            fullWidth
            helperText={t.caloriesAutoCalculatedHint}
            label={t.caloriesLabel}
            slotProps={{ input: { readOnly: true } }}
            type='number'
            value={calculatedActualCalories ?? ''}
          />
          <NumberField
            label={t.carbsGramsLabel}
            onChange={setCarbsGrams}
            value={carbsGrams}
          />
          <NumberField
            label={t.proteinGramsLabel}
            onChange={setProteinGrams}
            value={proteinGrams}
          />
          <NumberField
            label={t.fatGramsLabel}
            onChange={setFatGrams}
            value={fatGrams}
          />
          <SwitchField
            checked={strengthWorkoutDone}
            label={t.strengthWorkoutDoneLabel}
            onChange={setStrengthWorkoutDone}
          />
          <NumberField
            label={t.cardioMinutesLabel}
            onChange={setCardioMinutes}
            value={cardioMinutes}
          />
        </Stack>
      </FormSectionCard>

      <FormSectionCard title={t.wellbeingTitle}>
        <Stack
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <ScoreField
            label={t.columnMood}
            onChange={(value) => updateWellbeing('mood', value)}
            scoreHigh={t.scoreHigh}
            scoreLow={t.scoreLow}
            value={wellbeing.mood}
          />
          <ScoreField
            label={t.columnEnergy}
            onChange={(value) => updateWellbeing('energy', value)}
            scoreHigh={t.scoreHigh}
            scoreLow={t.scoreLow}
            value={wellbeing.energy}
          />
          <ScoreField
            label={t.columnStress}
            onChange={(value) => updateWellbeing('stress', value)}
            scoreHigh={t.scoreHigh}
            scoreLow={t.scoreLow}
            value={wellbeing.stress}
          />
          <ScoreField
            label={t.sorenessLabel}
            onChange={(value) => updateWellbeing('soreness', value)}
            scoreHigh={t.scoreHigh}
            scoreLow={t.scoreLow}
            value={wellbeing.soreness}
          />
          {settings?.trackLibido ? (
            <ScoreField
              label={t.libidoLabel}
              onChange={(value) => updateWellbeing('libido', value)}
              scoreHigh={t.scoreHigh}
              scoreLow={t.scoreLow}
              value={wellbeing.libido}
            />
          ) : null}
          <ScoreField
            label={t.motivationLabel}
            onChange={(value) => updateWellbeing('motivation', value)}
            scoreHigh={t.scoreHigh}
            scoreLow={t.scoreLow}
            value={wellbeing.motivation}
          />
          <ScoreField
            label={t.columnRecovery}
            onChange={(value) => updateWellbeing('recovery', value)}
            scoreHigh={t.scoreHigh}
            scoreLow={t.scoreLow}
            value={wellbeing.recovery}
          />
        </Stack>
      </FormSectionCard>

      <FormSectionCard title={t.bodyTitle}>
        <Stack spacing={1.5}>
          <NumberField
            label={t.bodyWeightLabel}
            onChange={setBodyWeightKg}
            value={bodyWeightKg}
          />
          <NumberField
            label={t.restingHeartRateLabel}
            onChange={setRestingHeartRate}
            value={restingHeartRate}
          />
        </Stack>
      </FormSectionCard>

      <FormSectionCard title={t.contextTitle}>
        <Stack spacing={1.5}>
          {settings?.trackMenstrualCycle ? (
            <TextField
              fullWidth
              label={t.menstruationPhaseLabel}
              onChange={(event) =>
                setMenstruationPhase(event.target.value as MenstruationPhase | '')
              }
              select
              value={menstruationPhase}
            >
              <MenuItem value=''>—</MenuItem>
              <MenuItem value='menstruation'>{t.menstruationPhaseMenstruation}</MenuItem>
              <MenuItem value='follicular'>{t.menstruationPhaseFollicular}</MenuItem>
              <MenuItem value='ovulation'>{t.menstruationPhaseOvulation}</MenuItem>
              <MenuItem value='luteal'>{t.menstruationPhaseLuteal}</MenuItem>
              <MenuItem value='unknown'>{t.menstruationPhaseUnknown}</MenuItem>
            </TextField>
          ) : null}
          <SwitchField checked={illness} label={t.illnessLabel} onChange={setIllness} />
          <TextField
            fullWidth
            label={t.notesLabel}
            minRows={3}
            multiline
            onChange={(event) => setNotes(event.target.value)}
            value={notes}
          />
        </Stack>
      </FormSectionCard>

      <input name='reportPayload' type='hidden' value={payload} />
      {reportId ? <input name='reportId' type='hidden' value={reportId} /> : null}

      <Paper
        elevation={8}
        sx={(theme) => ({
          position: 'sticky',
          bottom: 0,
          zIndex: theme.zIndex.appBar,
          p: 1.5,
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #111827, #0f172a)'
              : 'linear-gradient(180deg, #ffffff, #f8fafc)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 16px 34px rgba(2, 6, 23, 0.42)'
              : '0 14px 28px rgba(148, 163, 184, 0.14)',
        })}
      >
        <FormActionButtons
          clearLabel={translations.common.clearForm}
          discardLabel={onCancel ? translations.common.discardForm : undefined}
          onClear={resetFormDraft}
          onDiscard={onCancel}
          submitDisabled={!reportDateIso}
          submitFullWidth
          submitIcon={<SaveRoundedIcon />}
          submitLabel={submitLabel ?? t.saveReport}
        />
      </Paper>
    </Stack>
  );

  function updateWellbeing(
    key: keyof DailyWellbeingDraft,
    value: DailyScoreDraft,
  ) {
    setWellbeing((current) => ({ ...current, [key]: value }));
  }
}

function FormSectionCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}>
      <Stack spacing={2}>
        <Typography component='h2' variant='h6'>
          {title}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
}

function GoalSnapshotRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      spacing={2}
      sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}
    >
      <Typography color='text.secondary' variant='body2'>
        {label}
      </Typography>
      <Typography sx={{ textAlign: 'right' }} variant='body2'>
        {value}
      </Typography>
    </Stack>
  );
}

function NumberField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <TextField
      fullWidth
      inputMode='decimal'
      label={label}
      onChange={(event) => onChange(event.target.value)}
      type='number'
      value={value}
    />
  );
}

function ScoreField({
  label,
  onChange,
  scoreHigh,
  scoreLow,
  value,
}: {
  label: string;
  onChange: (value: DailyScoreDraft) => void;
  scoreHigh: string;
  scoreLow: string;
  value: DailyScoreDraft;
}) {
  return (
    <TextField
      fullWidth
      label={label}
      onChange={(event) => onChange(event.target.value as DailyScoreDraft)}
      select
      value={value}
    >
      <MenuItem value=''>—</MenuItem>
      <MenuItem value='1'>{`1 · ${scoreLow}`}</MenuItem>
      <MenuItem value='2'>2</MenuItem>
      <MenuItem value='3'>3</MenuItem>
      <MenuItem value='4'>4</MenuItem>
      <MenuItem value='5'>{`5 · ${scoreHigh}`}</MenuItem>
    </TextField>
  );
}

function SwitchField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <Paper
      elevation={0}
      sx={{ px: 1.5, border: 1, borderColor: 'divider', borderRadius: 4 }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
          />
        }
        label={label}
        sx={{ m: 0, minHeight: 56, width: '100%', justifyContent: 'space-between' }}
      />
    </Paper>
  );
}

function formatDateInput(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatInitialNumber(value: number | null | undefined): string {
  return value == null ? '' : String(value);
}

function formatInitialHydration(
  liters: number | null | undefined,
  unitSystem: UnitSystem,
): string {
  if (liters == null) {
    return '';
  }

  return String(convertHydrationFromMetricLiters(liters, unitSystem).value);
}

function formatInitialScore(
  value: 1 | 2 | 3 | 4 | 5 | null | undefined,
): DailyScoreDraft {
  return value == null ? '' : String(value) as DailyScoreDraft;
}

function formatGoalValue(
  value: number | null | undefined,
  suffix: string,
  emptyValue: string,
): string {
  if (value == null) {
    return emptyValue;
  }

  return suffix ? `${value} ${suffix}` : String(value);
}

function formatHydrationValue(
  liters: number | null | undefined,
  unitSystem: UnitSystem,
  emptyValue: string,
): string {
  if (liters == null) {
    return emptyValue;
  }

  const converted = convertHydrationFromMetricLiters(liters, unitSystem);

  return `${converted.value} ${converted.unit}`;
}

function formatBooleanValue(
  value: boolean | null | undefined,
  translations: TranslationDictionary['exercises'],
  emptyValue: string,
): string {
  if (value == null) {
    return emptyValue;
  }

  return value ? translations.yesLabel : translations.noLabel;
}

function normalizeOptionalNumber(value: string): number | null {
  const normalized = value.trim();

  return normalized ? Number(normalized) : null;
}

function resolveReportDateIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T12:00:00`);

  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normalizeOptionalScore(value: DailyScoreDraft): 1 | 2 | 3 | 4 | 5 | null {
  return value ? (Number(value) as 1 | 2 | 3 | 4 | 5) : null;
}

function resolveNumericGoalMet(
  goal: number | null,
  actualValue: string | number | null,
): boolean | null {
  if (goal == null) {
    return null;
  }

  const actual =
    typeof actualValue === 'number'
      ? actualValue
      : actualValue == null
        ? null
        : normalizeOptionalNumber(actualValue);

  if (actual == null) {
    return null;
  }

  return actual >= goal;
}

function resolveWaterLiters(
  displayValue: string,
  unitSystem: UnitSystem,
): number | null {
  const normalized = normalizeOptionalNumber(displayValue);

  if (normalized == null) {
    return null;
  }

  if (unitSystem === 'metric') {
    return normalized;
  }

  return convertHydrationToMetricLiters({
    system: unitSystem,
    value: normalized,
  });
}

function resolveSleepGoalMet(
  goals: AuthenticatedUserSnapshot['healthyHabits'] | null | undefined,
  sleepHours: string,
  sleepScheduleKept: boolean,
): boolean | null {
  const checks: Array<boolean | null> = [];

  if (goals?.averageSleepHoursPerDay != null) {
    checks.push(resolveNumericGoalMet(goals.averageSleepHoursPerDay, sleepHours));
  }

  if (goals?.regularSleepSchedule === true) {
    checks.push(sleepScheduleKept);
  }

  if (!checks.length) {
    return null;
  }

  if (checks.some((check) => check == null)) {
    return null;
  }

  return checks.every(Boolean);
}
