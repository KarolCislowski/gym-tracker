import { z } from 'zod';

const exerciseSetSchema = z.object({
  order: z.number().int().min(1),
  reps: z.number().int().min(0).nullable(),
  weight: z.number().min(0).nullable(),
  durationSec: z.number().int().min(0).nullable(),
  distanceMeters: z.number().min(0).nullable(),
  calories: z.number().min(0).nullable(),
  rpe: z.number().min(0).max(10).nullable(),
  rir: z.number().int().min(0).max(10).nullable(),
  isWarmup: z.boolean(),
  isFailure: z.boolean(),
  setKind: z.enum(['normal', 'drop', 'backoff', 'top']),
  parentSetOrder: z.number().int().min(1).nullable(),
  completedAt: z.date().nullable(),
});

const exerciseEntrySchema = z.object({
  order: z.number().int().min(1),
  exerciseId: z.string().trim().min(1),
  exerciseSlug: z.string().trim().min(1),
  variantId: z.string().trim().min(1).nullable(),
  trackableMetrics: z.array(z.string().trim().min(1)).default([]),
  selectedEquipment: z.array(z.string().trim().min(1)).default([]),
  selectedGrip: z.string().trim().min(1).nullable(),
  selectedStance: z.string().trim().min(1).nullable(),
  selectedAttachment: z.string().trim().min(1).nullable(),
  notes: z.string().trim().min(1).nullable(),
  restAfterEntrySec: z.number().int().min(0).nullable(),
  sets: z.array(exerciseSetSchema).min(1),
});

const workoutBlockSchema = z.object({
  order: z.number().int().min(1),
  type: z.enum(['single', 'superset', 'circuit', 'dropset']),
  name: z.string().trim().min(1).nullable(),
  rounds: z.number().int().min(1).nullable(),
  restAfterBlockSec: z.number().int().min(0).nullable(),
  entries: z.array(exerciseEntrySchema).min(1),
});

const workoutTemplateEntrySchema = z.object({
  order: z.number().int().min(1),
  exerciseId: z.string().trim().min(1),
  exerciseSlug: z.string().trim().min(1),
  variantId: z.string().trim().min(1).nullable(),
  selectedGrip: z.string().trim().min(1).nullable(),
  selectedStance: z.string().trim().min(1).nullable(),
  selectedAttachment: z.string().trim().min(1).nullable(),
  notes: z.string().trim().min(1).nullable(),
  restAfterEntrySec: z.number().int().min(0).nullable(),
});

const workoutTemplateBlockSchema = z.object({
  order: z.number().int().min(1),
  type: z.enum(['single', 'superset', 'circuit', 'dropset']),
  name: z.string().trim().min(1).nullable(),
  rounds: z.number().int().min(1).nullable(),
  restAfterBlockSec: z.number().int().min(0).nullable(),
  entries: z.array(workoutTemplateEntrySchema).min(1),
});

const workoutLocationSnapshotSchema = z.object({
  provider: z.literal('google_places'),
  placeId: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
  formattedAddress: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  countryCode: z.string().trim().min(1).nullable(),
  country: z.string().trim().min(1).nullable(),
  region: z.string().trim().min(1).nullable(),
  city: z.string().trim().min(1).nullable(),
  locality: z.string().trim().min(1).nullable(),
  postalCode: z.string().trim().min(1).nullable(),
});

const workoutWeatherSnapshotSchema = z.object({
  provider: z.string().trim().min(1),
  temperatureC: z.number().nullable(),
  apparentTemperatureC: z.number().nullable(),
  humidityPercent: z.number().min(0).max(100).nullable(),
  windSpeedKph: z.number().min(0).nullable(),
  precipitationMm: z.number().min(0).nullable(),
  weatherCode: z.string().trim().min(1).nullable(),
  capturedAt: z.date(),
});

export const createWorkoutSessionSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  workoutName: z.string().trim().min(2),
  startedAt: z.date().nullable(),
  endedAt: z.date().nullable(),
  durationMinutes: z.number().int().min(1).nullable(),
  performedAt: z.date(),
  notes: z.string().trim().min(1).nullable(),
  locationSnapshot: workoutLocationSnapshotSchema.nullable(),
  weatherSnapshot: workoutWeatherSnapshotSchema.nullable(),
  blocks: z.array(workoutBlockSchema).min(1),
});

export const updateWorkoutSessionSchema = createWorkoutSessionSchema.extend({
  reportId: z.string().trim().min(1),
});

export const createWorkoutTemplateSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  name: z.string().trim().min(2),
  notes: z.string().trim().min(1).nullable(),
  blocks: z.array(workoutTemplateBlockSchema).min(1),
});
