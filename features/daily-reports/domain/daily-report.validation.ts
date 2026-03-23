import { z } from 'zod';

const nullableScoreSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.null(),
]);

const nullableMenstruationPhaseSchema = z.union([
  z.literal('menstruation'),
  z.literal('follicular'),
  z.literal('ovulation'),
  z.literal('luteal'),
  z.literal('unknown'),
  z.null(),
]);

const nullableNumberSchema = z.number().min(0).nullable();
const nullableBooleanSchema = z.boolean().nullable();

export const createDailyReportSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  reportDate: z.date(),
  goalsSnapshot: z.object({
    averageSleepHoursPerDay: nullableNumberSchema,
    regularSleepSchedule: nullableBooleanSchema,
    stepsPerDay: nullableNumberSchema,
    waterLitersPerDay: nullableNumberSchema,
    proteinGramsPerDay: nullableNumberSchema,
    strengthWorkoutsPerWeek: nullableNumberSchema,
    cardioMinutesPerWeek: nullableNumberSchema,
  }),
  actuals: z.object({
    sleepHours: nullableNumberSchema,
    sleepScheduleKept: nullableBooleanSchema,
    steps: nullableNumberSchema,
    waterLiters: nullableNumberSchema,
    proteinGrams: nullableNumberSchema,
    strengthWorkoutDone: nullableBooleanSchema,
    cardioMinutes: nullableNumberSchema,
  }),
  wellbeing: z.object({
    mood: nullableScoreSchema,
    energy: nullableScoreSchema,
    stress: nullableScoreSchema,
    soreness: nullableScoreSchema,
    libido: nullableScoreSchema,
    motivation: nullableScoreSchema,
    recovery: nullableScoreSchema,
  }),
  body: z.object({
    bodyWeightKg: nullableNumberSchema,
    restingHeartRate: nullableNumberSchema,
  }),
  dayContext: z.object({
    weatherSnapshot: z
      .object({
        provider: z.string().trim().min(1),
        temperatureC: z.number().nullable(),
        apparentTemperatureC: z.number().nullable(),
        humidityPercent: z.number().min(0).max(100).nullable(),
        windSpeedKph: z.number().min(0).nullable(),
        precipitationMm: z.number().min(0).nullable(),
        weatherCode: z.string().trim().min(1).nullable(),
        capturedAt: z.date(),
      })
      .nullable(),
    menstruationPhase: nullableMenstruationPhaseSchema,
    illness: nullableBooleanSchema,
    notes: z.string().trim().min(1).nullable(),
  }),
  completion: z.object({
    sleepGoalMet: nullableBooleanSchema,
    stepsGoalMet: nullableBooleanSchema,
    waterGoalMet: nullableBooleanSchema,
    proteinGoalMet: nullableBooleanSchema,
    cardioGoalMet: nullableBooleanSchema,
  }),
});
