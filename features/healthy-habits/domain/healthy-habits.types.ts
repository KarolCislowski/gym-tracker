import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

export interface UpdateHealthyHabitsInput {
  averageSleepHoursPerDay: number | null;
  carbsGramsPerDay: number | null;
  cardioMinutesPerWeek: number | null;
  fatGramsPerDay: number | null;
  proteinGramsPerDay: number | null;
  regularSleepSchedule: boolean;
  stepsPerDay: number | null;
  strengthWorkoutsPerWeek: number | null;
  tenantDbName: string;
  unitSystem: UnitSystem;
  waterFluidOuncesPerDay: number | null;
  waterLitersPerDay: number | null;
}

export interface UpdateHealthyHabitsRecordInput {
  averageSleepHoursPerDay: number | null;
  caloriesPerDay: number | null;
  carbsGramsPerDay: number | null;
  cardioMinutesPerWeek: number | null;
  fatGramsPerDay: number | null;
  proteinGramsPerDay: number | null;
  regularSleepSchedule: boolean;
  stepsPerDay: number | null;
  strengthWorkoutsPerWeek: number | null;
  tenantDbName: string;
  waterLitersPerDay: number | null;
}
