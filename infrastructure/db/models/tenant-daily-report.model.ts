import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantDailyReport } from './tenant-daily-report.types';

export type TenantDailyReportDocument = HydratedDocument<TenantDailyReport>;

const nullableNumberField = {
  type: Number,
  required: false,
  default: null,
} as const;

const nullableBooleanField = {
  type: Boolean,
  required: false,
  default: null,
} as const;

const tenantDailyWeatherSnapshotSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    temperatureC: nullableNumberField,
    apparentTemperatureC: nullableNumberField,
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

const tenantDailyReportSchema = new Schema<TenantDailyReport>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    reportDate: {
      type: Date,
      required: true,
      index: true,
    },
    goalsSnapshot: {
      type: {
        averageSleepHoursPerDay: nullableNumberField,
        regularSleepSchedule: nullableBooleanField,
        stepsPerDay: nullableNumberField,
        waterLitersPerDay: nullableNumberField,
        proteinGramsPerDay: nullableNumberField,
        strengthWorkoutsPerWeek: nullableNumberField,
        cardioMinutesPerWeek: nullableNumberField,
      },
      required: true,
      default: {},
    },
    actuals: {
      type: {
        sleepHours: nullableNumberField,
        sleepScheduleKept: nullableBooleanField,
        steps: nullableNumberField,
        waterLiters: nullableNumberField,
        proteinGrams: nullableNumberField,
        strengthWorkoutDone: nullableBooleanField,
        cardioMinutes: nullableNumberField,
      },
      required: true,
      default: {},
    },
    wellbeing: {
      type: {
        mood: { type: Number, required: false, min: 1, max: 5, default: null },
        energy: { type: Number, required: false, min: 1, max: 5, default: null },
        stress: { type: Number, required: false, min: 1, max: 5, default: null },
        soreness: { type: Number, required: false, min: 1, max: 5, default: null },
        libido: { type: Number, required: false, min: 1, max: 5, default: null },
        motivation: { type: Number, required: false, min: 1, max: 5, default: null },
        recovery: { type: Number, required: false, min: 1, max: 5, default: null },
      },
      required: true,
      default: {},
    },
    body: {
      type: {
        bodyWeightKg: nullableNumberField,
        restingHeartRate: nullableNumberField,
      },
      required: true,
      default: {},
    },
    dayContext: {
      type: {
        weatherSnapshot: {
          type: tenantDailyWeatherSnapshotSchema,
          required: false,
          default: null,
        },
        menstruationPhase: {
          type: String,
          required: false,
          enum: ['menstruation', 'follicular', 'ovulation', 'luteal', 'unknown'],
          default: null,
        },
        illness: nullableBooleanField,
        notes: {
          type: String,
          required: false,
          default: null,
        },
      },
      required: true,
      default: {},
    },
    completion: {
      type: {
        sleepGoalMet: nullableBooleanField,
        stepsGoalMet: nullableBooleanField,
        waterGoalMet: nullableBooleanField,
        proteinGoalMet: nullableBooleanField,
        cardioGoalMet: nullableBooleanField,
      },
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'tenant_daily_reports',
  },
);

/**
 * Returns the TenantDailyReport model bound to a specific tenant database.
 */
export async function getTenantDailyReportModel(
  tenantDatabaseName: string,
): Promise<Model<TenantDailyReport>> {
  const connection = await getTenantDbConnection(tenantDatabaseName);
  const existingModel = connection.models.TenantDailyReport as
    | Model<TenantDailyReport>
    | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('goalsSnapshot')) &&
      Boolean(existingModel.schema.path('wellbeing')) &&
      Boolean(existingModel.schema.path('completion')) &&
      Boolean(existingModel.schema.path('wellbeing.libido'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantDailyReport');
  }

  return connection.model<TenantDailyReport>(
    'TenantDailyReport',
    tenantDailyReportSchema,
  );
}
