import { describe, expect, test, vi } from 'vitest';

import { updateHealthyHabits } from './healthy-habits.service';

vi.mock('../infrastructure/healthy-habits.db', () => ({
  updateTenantHealthyHabitsRecord: vi.fn(),
}));

import { updateTenantHealthyHabitsRecord } from '../infrastructure/healthy-habits.db';

const mockedUpdateTenantHealthyHabitsRecord = vi.mocked(
  updateTenantHealthyHabitsRecord,
);

describe('healthy-habits.service', () => {
  /**
   * Verifies that imperial display values are normalized to metric persistence values.
   */
  test('updateHealthyHabits converts imperial hydration and protein goals to metric', async () => {
    await updateHealthyHabits({
      tenantDbName: 'tenant_john',
      unitSystem: 'imperial_uk',
      averageSleepHoursPerDay: 7.5,
      regularSleepSchedule: true,
      stepsPerDay: 9000,
      waterLitersPerDay: null,
      waterFluidOuncesPerDay: 70.4,
      carbsGramsPerDay: 320,
      proteinGramsPerDay: 150,
      fatGramsPerDay: 80,
      strengthWorkoutsPerWeek: 3,
      cardioMinutesPerWeek: 120,
    });

    expect(mockedUpdateTenantHealthyHabitsRecord).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      averageSleepHoursPerDay: 7.5,
      regularSleepSchedule: true,
      stepsPerDay: 9000,
      waterLitersPerDay: 2,
      caloriesPerDay: 2600,
      carbsGramsPerDay: 320,
      proteinGramsPerDay: 150,
      fatGramsPerDay: 80,
      strengthWorkoutsPerWeek: 3,
      cardioMinutesPerWeek: 120,
    });
  });
});
