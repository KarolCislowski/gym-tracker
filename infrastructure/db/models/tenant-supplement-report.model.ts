import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantSupplementReport } from './tenant-supplement-report.types';

export type TenantSupplementReportDocument =
  HydratedDocument<TenantSupplementReport>;

const tenantSupplementReportItemSchema = new Schema(
  {
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    supplementId: {
      type: String,
      required: true,
      trim: true,
    },
    supplementSlug: {
      type: String,
      required: true,
      trim: true,
    },
    supplementName: {
      type: String,
      required: true,
      trim: true,
    },
    variantId: {
      type: String,
      required: false,
      default: null,
    },
    variantSlug: {
      type: String,
      required: false,
      default: null,
    },
    variantName: {
      type: String,
      required: false,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['mg', 'g', 'mcg', 'ml', 'capsule', 'tablet', 'scoop', 'softgel'],
    },
    notes: {
      type: String,
      required: false,
      default: null,
    },
  },
  { _id: false },
);

const tenantSupplementReportSchema = new Schema<TenantSupplementReport>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    takenAt: {
      type: Date,
      required: true,
      index: true,
    },
    stackId: {
      type: String,
      required: false,
      default: null,
    },
    stackName: {
      type: String,
      required: true,
      trim: true,
    },
    context: {
      type: String,
      required: true,
      enum: [
        'pre_workout',
        'intra_workout',
        'post_workout',
        'morning',
        'evening',
        'with_meal',
        'daily',
        'flexible',
        'custom',
      ],
    },
    notes: {
      type: String,
      required: false,
      default: null,
    },
    items: {
      type: [tenantSupplementReportItemSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'tenant_supplement_reports',
  },
);

/**
 * Returns the tenant-bound supplement-report model.
 * @param tenantDbName - Tenant database name resolved for the active user.
 * @returns A supplement-report model scoped to the tenant database.
 */
export async function getTenantSupplementReportModel(
  tenantDbName: string,
): Promise<Model<TenantSupplementReport>> {
  const connection = await getTenantDbConnection(tenantDbName);
  const existingModel = connection.models.TenantSupplementReport as
    | Model<TenantSupplementReport>
    | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('stackName')) &&
      Boolean(existingModel.schema.path('context')) &&
      Boolean(existingModel.schema.path('items.variantName'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantSupplementReport');
  }

  return connection.model<TenantSupplementReport>(
    'TenantSupplementReport',
    tenantSupplementReportSchema,
  );
}
