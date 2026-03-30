'use client';

import { useMemo, useState } from 'react';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import {
  convertHydrationFromMetricLiters,
} from '@/shared/units/application/unit-conversion';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { calculateCaloriesFromMacros } from '@/shared/nutrition/application/macro-calculations';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';
import { useUnsavedChangesWarning } from '@/shared/ui/use-unsaved-changes-warning';

import { updateHealthyHabitsAction } from '../infrastructure/healthy-habits.actions';

interface HealthyHabitsEditFormProps {
  onCancel?: () => void;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Editable healthy habits form for tenant goal data.
 * @param props - Component props for the editable healthy habits form.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current snapshot.
 * @returns A React element rendering the editable healthy habits form.
 */
export function HealthyHabitsEditForm({
  onCancel,
  translations,
  userSnapshot,
}: HealthyHabitsEditFormProps) {
  const t = translations.healthyHabits;
  const { formRef, markSubmitted } = useUnsavedChangesWarning({
    message: translations.common.unsavedChangesWarning,
  });
  const habits = userSnapshot?.healthyHabits;
  const unitSystem = userSnapshot?.settings?.unitSystem ?? 'metric';
  const waterValue =
    habits?.waterLitersPerDay != null
      ? convertHydrationFromMetricLiters(habits.waterLitersPerDay, unitSystem)
      : null;
  const initialCarbsGramsPerDay =
    habits?.carbsGramsPerDay != null ? String(habits.carbsGramsPerDay) : '';
  const initialProteinGramsPerDay =
    habits?.proteinGramsPerDay != null ? String(habits.proteinGramsPerDay) : '';
  const initialFatGramsPerDay =
    habits?.fatGramsPerDay != null ? String(habits.fatGramsPerDay) : '';
  const [carbsGramsPerDay, setCarbsGramsPerDay] = useState(
    initialCarbsGramsPerDay,
  );
  const [proteinGramsPerDay, setProteinGramsPerDay] = useState(
    initialProteinGramsPerDay,
  );
  const [fatGramsPerDay, setFatGramsPerDay] = useState(
    initialFatGramsPerDay,
  );
  const calculatedCaloriesPerDay = useMemo(
    () =>
      calculateCaloriesFromMacros({
        proteinGrams: normalizeOptionalNumber(proteinGramsPerDay),
        carbsGrams: normalizeOptionalNumber(carbsGramsPerDay),
        fatGrams: normalizeOptionalNumber(fatGramsPerDay),
      }),
    [carbsGramsPerDay, fatGramsPerDay, proteinGramsPerDay],
  );

  return (
    <Stack
      component='form'
      action={updateHealthyHabitsAction}
      onSubmitCapture={markSubmitted}
      ref={formRef}
      spacing={2}
    >
      <input type='hidden' name='unitSystem' value={unitSystem} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <TextField
          defaultValue={habits?.averageSleepHoursPerDay ?? ''}
          label={t.averageSleepHoursPerDayLabel}
          name='averageSleepHoursPerDay'
          slotProps={{ htmlInput: { min: 0, max: 24, step: 0.1 } }}
          type='number'
        />
        <Box>
          <input type='hidden' name='regularSleepSchedule' value='false' />
          <FormControlLabel
            control={
              <Switch
                defaultChecked={habits?.regularSleepSchedule ?? false}
                name='regularSleepSchedule'
                value='true'
              />
            }
            label={t.regularSleepScheduleLabel}
          />
        </Box>
        <TextField
          defaultValue={habits?.stepsPerDay ?? ''}
          label={t.stepsPerDayLabel}
          name='stepsPerDay'
          slotProps={{ htmlInput: { min: 0, max: 100000, step: 100 } }}
          type='number'
        />
        {unitSystem === 'metric' ? (
          <TextField
            defaultValue={
              waterValue?.system === 'metric' ? waterValue.value : ''
            }
            label={t.waterLitersPerDayLabel}
            name='waterLitersPerDay'
            slotProps={{ htmlInput: { min: 0, max: 20, step: 0.1 } }}
            type='number'
          />
        ) : (
          <TextField
            defaultValue={
              waterValue && waterValue.system !== 'metric' ? waterValue.value : ''
            }
            label={t.waterFluidOuncesPerDayLabel}
            name='waterFluidOuncesPerDay'
            slotProps={{ htmlInput: { min: 0, max: 700, step: 1 } }}
            type='number'
          />
        )}
        <TextField
          helperText={t.caloriesAutoCalculatedHint}
          label={t.caloriesPerDayLabel}
          slotProps={{
            input: { readOnly: true },
          }}
          type='number'
          value={calculatedCaloriesPerDay ?? ''}
        />
        <TextField
          label={t.carbsPerDayLabel}
          name='carbsGramsPerDay'
          onChange={(event) => setCarbsGramsPerDay(event.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 1500, step: 1 } }}
          type='number'
          value={carbsGramsPerDay}
        />
        <TextField
          label={t.proteinPerDayLabel}
          name='proteinGramsPerDay'
          onChange={(event) => setProteinGramsPerDay(event.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 1000, step: 1 } }}
          type='number'
          value={proteinGramsPerDay}
        />
        <TextField
          label={t.fatPerDayLabel}
          name='fatGramsPerDay'
          onChange={(event) => setFatGramsPerDay(event.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 500, step: 1 } }}
          type='number'
          value={fatGramsPerDay}
        />
        <TextField
          defaultValue={habits?.strengthWorkoutsPerWeek ?? ''}
          label={t.strengthWorkoutsPerWeekLabel}
          name='strengthWorkoutsPerWeek'
          slotProps={{ htmlInput: { min: 0, max: 14, step: 1 } }}
          type='number'
        />
        <TextField
          defaultValue={habits?.cardioMinutesPerWeek ?? ''}
          label={t.cardioMinutesPerWeekLabel}
          name='cardioMinutesPerWeek'
          slotProps={{ htmlInput: { min: 0, max: 5000, step: 5 } }}
          type='number'
        />
      </Box>

      <FormActionButtons
        clearLabel={translations.common.clearForm}
        discardLabel={onCancel ? translations.common.discardForm : undefined}
        onClear={() => {
          formRef.current?.reset();
          setCarbsGramsPerDay(initialCarbsGramsPerDay);
          setProteinGramsPerDay(initialProteinGramsPerDay);
          setFatGramsPerDay(initialFatGramsPerDay);
        }}
        onDiscard={onCancel}
        submitIcon={<SaveRoundedIcon />}
        submitLabel={t.saveChanges}
      />
    </Stack>
  );
}

function normalizeOptionalNumber(value: string): number | null {
  const normalized = value.trim();

  return normalized ? Number(normalized) : null;
}
