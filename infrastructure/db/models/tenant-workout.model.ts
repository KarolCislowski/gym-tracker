import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantWorkout } from './tenant-workout.types';

export type TenantWorkoutDocument = HydratedDocument<TenantWorkout>;

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

  return (
    (connection.models.TenantWorkout as Model<TenantWorkout> | undefined) ??
    connection.model<TenantWorkout>('TenantWorkout', tenantWorkoutSchema)
  );
}
