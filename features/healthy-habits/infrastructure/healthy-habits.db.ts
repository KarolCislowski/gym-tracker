import { getTenantHealthyHabitsModel } from '@/infrastructure/db/models/tenant-healthy-habits.model';

import type { UpdateHealthyHabitsRecordInput } from '../domain/healthy-habits.types';

/**
 * Updates the authenticated user's healthy habits document.
 * @param input - Healthy habits values to persist in the tenant document.
 * @returns A promise that resolves when the tenant healthy habits document has been updated.
 * @remarks The existing document is assumed to exist because it is created during tenant bootstrap.
 */
export async function updateTenantHealthyHabitsRecord(
  input: UpdateHealthyHabitsRecordInput,
): Promise<void> {
  const TenantHealthyHabitsModel = await getTenantHealthyHabitsModel(
    input.tenantDbName,
  );

  await TenantHealthyHabitsModel.updateOne(
    { scope: 'tenant' },
    {
      $set: {
        averageSleepHoursPerDay: input.averageSleepHoursPerDay,
        regularSleepSchedule: input.regularSleepSchedule,
        stepsPerDay: input.stepsPerDay,
        waterLitersPerDay: input.waterLitersPerDay,
        proteinGramsPerDay: input.proteinGramsPerDay,
        strengthWorkoutsPerWeek: input.strengthWorkoutsPerWeek,
        cardioMinutesPerWeek: input.cardioMinutesPerWeek,
      },
    },
    { upsert: true },
  );
}
