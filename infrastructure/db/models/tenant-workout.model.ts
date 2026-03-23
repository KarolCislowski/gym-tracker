import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantWorkout } from './tenant-workout.types';

export type TenantWorkoutDocument = HydratedDocument<TenantWorkout>;

const tenantWorkoutSetSchema = new Schema(
  {
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    weight: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    durationSec: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    distanceMeters: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    calories: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    rpe: {
      type: Number,
      required: false,
      min: 0,
      max: 10,
      default: null,
    },
    rir: {
      type: Number,
      required: false,
      min: 0,
      max: 10,
      default: null,
    },
    isWarmup: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFailure: {
      type: Boolean,
      required: true,
      default: false,
    },
    setKind: {
      type: String,
      required: true,
      enum: ['normal', 'drop', 'backoff', 'top'],
      default: 'normal',
    },
    parentSetOrder: {
      type: Number,
      required: false,
      min: 1,
      default: null,
    },
    completedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { _id: false },
);

const tenantWorkoutExerciseEntrySchema = new Schema(
  {
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    exerciseId: {
      type: String,
      required: true,
      trim: true,
    },
    exerciseSlug: {
      type: String,
      required: true,
      trim: true,
    },
    variantId: {
      type: String,
      required: false,
      default: null,
    },
    selectedEquipment: {
      type: [String],
      required: true,
      default: [],
    },
    selectedGrip: {
      type: String,
      required: false,
      default: null,
    },
    selectedStance: {
      type: String,
      required: false,
      default: null,
    },
    selectedAttachment: {
      type: String,
      required: false,
      default: null,
    },
    notes: {
      type: String,
      required: false,
      default: null,
    },
    restAfterEntrySec: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    sets: {
      type: [tenantWorkoutSetSchema],
      required: true,
      default: [],
    },
  },
  { _id: false },
);

const tenantWorkoutBlockSchema = new Schema(
  {
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      required: true,
      enum: ['single', 'superset', 'circuit', 'dropset'],
    },
    name: {
      type: String,
      required: false,
      default: null,
    },
    rounds: {
      type: Number,
      required: false,
      min: 1,
      default: null,
    },
    restAfterBlockSec: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    entries: {
      type: [tenantWorkoutExerciseEntrySchema],
      required: true,
      default: [],
    },
  },
  { _id: false },
);

const tenantWorkoutLocationSnapshotSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      enum: ['google_places'],
    },
    placeId: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    formattedAddress: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    countryCode: {
      type: String,
      required: false,
      default: null,
    },
    country: {
      type: String,
      required: false,
      default: null,
    },
    region: {
      type: String,
      required: false,
      default: null,
    },
    city: {
      type: String,
      required: false,
      default: null,
    },
    locality: {
      type: String,
      required: false,
      default: null,
    },
    postalCode: {
      type: String,
      required: false,
      default: null,
    },
  },
  { _id: false },
);

const tenantWorkoutWeatherSnapshotSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    temperatureC: {
      type: Number,
      required: false,
      default: null,
    },
    apparentTemperatureC: {
      type: Number,
      required: false,
      default: null,
    },
    humidityPercent: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
      default: null,
    },
    windSpeedKph: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    precipitationMm: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    weatherCode: {
      type: String,
      required: false,
      default: null,
    },
    capturedAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);

const tenantWorkoutSchema = new Schema<TenantWorkout>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    workoutName: {
      type: String,
      required: true,
      trim: true,
    },
    startedAt: {
      type: Date,
      required: false,
      default: null,
    },
    endedAt: {
      type: Date,
      required: false,
      default: null,
    },
    durationMinutes: {
      type: Number,
      required: false,
      min: 1,
      default: null,
    },
    performedAt: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      required: false,
      default: null,
    },
    locationSnapshot: {
      type: tenantWorkoutLocationSnapshotSchema,
      required: false,
      default: null,
    },
    weatherSnapshot: {
      type: tenantWorkoutWeatherSnapshotSchema,
      required: false,
      default: null,
    },
    blocks: {
      type: [tenantWorkoutBlockSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'tenant_workouts',
  },
);

/**
 * Returns the TenantWorkout model bound to a specific tenant database.
 */
export async function getTenantWorkoutModel(
  tenantDatabaseName: string,
): Promise<Model<TenantWorkout>> {
  const connection = await getTenantDbConnection(tenantDatabaseName);
  const existingModel = connection.models.TenantWorkout as
    | Model<TenantWorkout>
    | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('blocks')) &&
      Boolean(existingModel.schema.path('locationSnapshot')) &&
      Boolean(existingModel.schema.path('weatherSnapshot'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantWorkout');
  }

  return connection.model<TenantWorkout>('TenantWorkout', tenantWorkoutSchema);
}
