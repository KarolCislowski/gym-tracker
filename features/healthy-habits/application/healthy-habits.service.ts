import {
  convertHydrationToMetricLiters,
} from '@/shared/units/application/unit-conversion';

import { updateHealthyHabitsSchema } from '../domain/healthy-habits.validation';
import type { UpdateHealthyHabitsInput } from '../domain/healthy-habits.types';
import { updateTenantHealthyHabitsRecord } from '../infrastructure/healthy-habits.db';

/**
 * Updates tenant healthy habits goals using metric persistence values.
 * @param input - Healthy habits values submitted through the UI.
 * @returns A promise that resolves when the tenant healthy habits document has been updated.
 * @remarks Presentation-layer unit inputs are normalized to metric before validation and persistence.
 */
export async function updateHealthyHabits(
  input: UpdateHealthyHabitsInput,
): Promise<void> {
  const parsedInput = updateHealthyHabitsSchema.parse({
    tenantDbName: input.tenantDbName,
    averageSleepHoursPerDay: input.averageSleepHoursPerDay,
    stepsPerDay: input.stepsPerDay,
    waterLitersPerDay: resolveWaterLiters(input),
    proteinGramsPerDay: input.proteinGramsPerDay,
    strengthWorkoutsPerWeek: input.strengthWorkoutsPerWeek,
    cardioMinutesPerWeek: input.cardioMinutesPerWeek,
  });

  await updateTenantHealthyHabitsRecord(parsedInput);
}

function resolveWaterLiters(input: UpdateHealthyHabitsInput): number | null {
  if (input.unitSystem === 'metric') {
    return input.waterLitersPerDay;
  }

  if (input.waterFluidOuncesPerDay == null) {
    return null;
  }

  return convertHydrationToMetricLiters({
    system: input.unitSystem,
    value: input.waterFluidOuncesPerDay,
  });
}
