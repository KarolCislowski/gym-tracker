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

import { createDailyReportAction } from '../infrastructure/daily-report.actions';

interface DailyReportFormProps {
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

type DailyScoreDraft = '' | '1' | '2' | '3' | '4' | '5';

interface DailyWellbeingDraft {
  mood: DailyScoreDraft;
  energy: DailyScoreDraft;
  stress: DailyScoreDraft;
  soreness: DailyScoreDraft;
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
  translations,
  userSnapshot,
}: DailyReportFormProps) {
  const t = translations.dailyReports;
  const habitsT = translations.healthyHabits;
  const profileT = translations.profile;
  const yesNoT = translations.exercises;
  const goals = userSnapshot?.healthyHabits;

  const [reportDate, setReportDate] = useState(formatDateInput(new Date()));
  const [sleepHours, setSleepHours] = useState('');
  const [sleepScheduleKept, setSleepScheduleKept] = useState(false);
  const [steps, setSteps] = useState('');
  const [waterLiters, setWaterLiters] = useState('');
  const [proteinGrams, setProteinGrams] = useState('');
  const [strengthWorkoutDone, setStrengthWorkoutDone] = useState(false);
  const [cardioMinutes, setCardioMinutes] = useState('');
  const [bodyWeightKg, setBodyWeightKg] = useState('');
  const [restingHeartRate, setRestingHeartRate] = useState('');
  const [menstruationPhase, setMenstruationPhase] = useState('');
  const [illness, setIllness] = useState(false);
  const [notes, setNotes] = useState('');
  const [wellbeing, setWellbeing] = useState<DailyWellbeingDraft>({
    mood: '',
    energy: '',
    stress: '',
    soreness: '',
    motivation: '',
    recovery: '',
  });

  const completion = useMemo(
    () => ({
      sleepGoalMet: resolveSleepGoalMet(goals, sleepHours, sleepScheduleKept),
      stepsGoalMet: resolveNumericGoalMet(goals?.stepsPerDay ?? null, steps),
      waterGoalMet: resolveNumericGoalMet(
        goals?.waterLitersPerDay ?? null,
        waterLiters,
      ),
      proteinGoalMet: resolveNumericGoalMet(
        goals?.proteinGramsPerDay ?? null,
        proteinGrams,
      ),
      cardioGoalMet: resolveNumericGoalMet(
        goals?.cardioMinutesPerWeek != null
          ? goals.cardioMinutesPerWeek / 7
          : null,
        cardioMinutes,
      ),
    }),
    [
      cardioMinutes,
      goals,
      proteinGrams,
      sleepHours,
      sleepScheduleKept,
      steps,
      waterLiters,
    ],
  );

  const payload = useMemo(
    () =>
      JSON.stringify({
        reportDate: new Date(`${reportDate}T12:00:00`).toISOString(),
        actuals: {
          sleepHours: normalizeOptionalNumber(sleepHours),
          sleepScheduleKept:
            goals?.regularSleepSchedule === true ? sleepScheduleKept : null,
          steps: normalizeOptionalNumber(steps),
          waterLiters: normalizeOptionalNumber(waterLiters),
          proteinGrams: normalizeOptionalNumber(proteinGrams),
          strengthWorkoutDone,
          cardioMinutes: normalizeOptionalNumber(cardioMinutes),
        },
        wellbeing: {
          mood: normalizeOptionalScore(wellbeing.mood),
          energy: normalizeOptionalScore(wellbeing.energy),
          stress: normalizeOptionalScore(wellbeing.stress),
          soreness: normalizeOptionalScore(wellbeing.soreness),
          motivation: normalizeOptionalScore(wellbeing.motivation),
          recovery: normalizeOptionalScore(wellbeing.recovery),
        },
        body: {
          bodyWeightKg: normalizeOptionalNumber(bodyWeightKg),
          restingHeartRate: normalizeOptionalNumber(restingHeartRate),
        },
        dayContext: {
          weatherSnapshot: null,
          menstruationPhase: menstruationPhase.trim() || null,
          illness,
          notes: notes.trim() || null,
        },
        completion,
      }),
    [
      bodyWeightKg,
      cardioMinutes,
      completion,
      goals?.regularSleepSchedule,
      illness,
      menstruationPhase,
      notes,
      proteinGrams,
      reportDate,
      restingHeartRate,
      sleepHours,
      sleepScheduleKept,
      steps,
      strengthWorkoutDone,
      waterLiters,
      wellbeing,
    ],
  );

  return (
    <Stack component='form' action={createDailyReportAction} spacing={2.5}>
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
              label={habitsT.waterLitersPerDayLabel}
              value={formatGoalValue(goals?.waterLitersPerDay, 'L', profileT.emptyValue)}
            />
            <GoalSnapshotRow
              label={habitsT.proteinPerDayLabel}
              value={formatGoalValue(goals?.proteinGramsPerDay, 'g', profileT.emptyValue)}
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
            label={t.waterLitersLabel}
            onChange={setWaterLiters}
            value={waterLiters}
          />
          <NumberField
            label={t.proteinGramsLabel}
            onChange={setProteinGrams}
            value={proteinGrams}
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
          <TextField
            fullWidth
            label={t.menstruationPhaseLabel}
            onChange={(event) => setMenstruationPhase(event.target.value)}
            value={menstruationPhase}
          />
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

      <Paper
        elevation={8}
        sx={{
          position: 'sticky',
          bottom: 0,
          p: 1.5,
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button
          fullWidth
          size='large'
          startIcon={<SaveRoundedIcon />}
          type='submit'
          variant='contained'
        >
          {t.saveReport}
        </Button>
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

function normalizeOptionalScore(value: DailyScoreDraft): 1 | 2 | 3 | 4 | 5 | null {
  return value ? (Number(value) as 1 | 2 | 3 | 4 | 5) : null;
}

function resolveNumericGoalMet(
  goal: number | null,
  actualValue: string,
): boolean | null {
  if (goal == null) {
    return null;
  }

  const actual = normalizeOptionalNumber(actualValue);

  if (actual == null) {
    return null;
  }

  return actual >= goal;
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
