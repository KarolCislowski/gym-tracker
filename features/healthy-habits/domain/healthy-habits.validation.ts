import { z } from 'zod';

export const updateHealthyHabitsSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  averageSleepHoursPerDay: z.number().min(0).max(24).nullable(),
  regularSleepSchedule: z.boolean(),
  stepsPerDay: z.number().int().min(0).max(100000).nullable(),
  waterLitersPerDay: z.number().min(0).max(20).nullable(),
  carbsGramsPerDay: z.number().min(0).max(1500).nullable(),
  proteinGramsPerDay: z.number().min(0).max(1000).nullable(),
  fatGramsPerDay: z.number().min(0).max(500).nullable(),
  strengthWorkoutsPerWeek: z.number().int().min(0).max(14).nullable(),
  cardioMinutesPerWeek: z.number().int().min(0).max(5000).nullable(),
});
