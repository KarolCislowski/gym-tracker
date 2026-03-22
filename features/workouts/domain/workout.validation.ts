import { z } from 'zod';

const exerciseSetSchema = z.object({
  order: z.number().int().min(1),
  reps: z.number().int().min(0).nullable(),
  weight: z.number().min(0).nullable(),
  durationSec: z.number().int().min(0).nullable(),
  distanceMeters: z.number().min(0).nullable(),
  rpe: z.number().min(0).max(10).nullable(),
  rir: z.number().int().min(0).max(10).nullable(),
  isWarmup: z.boolean(),
  isFailure: z.boolean(),
});

const exerciseEntrySchema = z.object({
  exerciseId: z.string().trim().min(1),
  variantId: z.string().trim().min(1).nullable(),
  selectedEquipment: z.array(z.string().trim().min(1)).default([]),
  selectedGrip: z.string().trim().min(1).nullable(),
  selectedStance: z.string().trim().min(1).nullable(),
  selectedAttachment: z.string().trim().min(1).nullable(),
  notes: z.string().trim().min(1).nullable(),
  sets: z.array(exerciseSetSchema).min(1),
});

export const createWorkoutSessionSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  workoutName: z.string().trim().min(2),
  durationMinutes: z.number().int().min(1),
  performedAt: z.date(),
  notes: z.string().trim().min(1).nullable(),
  exerciseEntries: z.array(exerciseEntrySchema).min(1),
});
