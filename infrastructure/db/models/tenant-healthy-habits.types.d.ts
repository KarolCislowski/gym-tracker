import type { Types } from 'mongoose';

export interface TenantHealthyHabits {
  _id: Types.ObjectId;
  scope: 'tenant';
  averageSleepHoursPerDay: number | null;
  caloriesPerDay: number | null;
  carbsGramsPerDay: number | null;
  cardioMinutesPerWeek: number | null;
  createdAt: Date;
  fatGramsPerDay: number | null;
  proteinGramsPerDay: number | null;
  regularSleepSchedule: boolean;
  stepsPerDay: number | null;
  strengthWorkoutsPerWeek: number | null;
  waterLitersPerDay: number | null;
}
