import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantHealthyHabits } from './tenant-healthy-habits.types';

export type TenantHealthyHabitsDocument = HydratedDocument<TenantHealthyHabits>;

const tenantHealthyHabitsSchema = new Schema<TenantHealthyHabits>(
  {
    scope: {
      type: String,
      required: true,
      enum: ['tenant'],
      unique: true,
      default: 'tenant',
    },
    averageSleepHoursPerDay: {
      type: Number,
      required: false,
      min: 0,
      max: 24,
      default: null,
    },
    stepsPerDay: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    waterLitersPerDay: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    proteinGramsPerDay: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
    strengthWorkoutsPerWeek: {
      type: Number,
      required: false,
      min: 0,
      max: 14,
      default: null,
    },
    cardioMinutesPerWeek: {
      type: Number,
      required: false,
      min: 0,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    collection: 'healthy_habits',
  },
);

/**
 * Returns the TenantHealthyHabits model bound to a specific tenant database.
 * @param tenantDbName - Name of the tenant database.
 * @returns A promise resolving to the healthy habits model for the tenant database.
 * @remarks In development the model cache is refreshed after schema changes so newly added fields are not ignored.
 */
export async function getTenantHealthyHabitsModel(
  tenantDbName: string,
): Promise<Model<TenantHealthyHabits>> {
  const connection = await getTenantDbConnection(tenantDbName);
  const existingModel = connection.models.TenantHealthyHabits as
    | Model<TenantHealthyHabits>
    | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('averageSleepHoursPerDay')) &&
      Boolean(existingModel.schema.path('waterLitersPerDay')) &&
      Boolean(existingModel.schema.path('proteinGramsPerDay'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantHealthyHabits');
  }

  return connection.model<TenantHealthyHabits>(
    'TenantHealthyHabits',
    tenantHealthyHabitsSchema,
  );
}
