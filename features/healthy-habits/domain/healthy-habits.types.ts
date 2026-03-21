import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

export interface UpdateHealthyHabitsInput {
  averageSleepHoursPerDay: number | null;
  cardioMinutesPerWeek: number | null;
  proteinGramsPerDay: number | null;
  stepsPerDay: number | null;
  strengthWorkoutsPerWeek: number | null;
  tenantDbName: string;
  unitSystem: UnitSystem;
  waterFluidOuncesPerDay: number | null;
  waterLitersPerDay: number | null;
}

export interface UpdateHealthyHabitsRecordInput {
  averageSleepHoursPerDay: number | null;
  cardioMinutesPerWeek: number | null;
  proteinGramsPerDay: number | null;
  stepsPerDay: number | null;
  strengthWorkoutsPerWeek: number | null;
  tenantDbName: string;
  waterLitersPerDay: number | null;
}
