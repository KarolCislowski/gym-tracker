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
  },
  { _id: false },
);

const tenantWorkoutExerciseEntrySchema = new Schema(
  {
    exerciseId: {
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
    sets: {
      type: [tenantWorkoutSetSchema],
      required: true,
      default: [],
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
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
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
    exerciseEntries: {
      type: [tenantWorkoutExerciseEntrySchema],
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
    const hasLatestSchemaFields = Boolean(
      existingModel.schema.path('exerciseEntries'),
    );

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantWorkout');
  }

  return connection.model<TenantWorkout>('TenantWorkout', tenantWorkoutSchema);
}
