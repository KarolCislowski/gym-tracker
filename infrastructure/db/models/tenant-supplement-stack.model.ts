import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantSupplementStack } from './tenant-supplement-stack.types';

export type TenantSupplementStackDocument =
  HydratedDocument<TenantSupplementStack>;

const tenantSupplementStackItemSchema = new Schema(
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

const tenantSupplementStackSchema = new Schema<TenantSupplementStack>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
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
    isFavorite: {
      type: Boolean,
      required: true,
      default: false,
    },
    items: {
      type: [tenantSupplementStackItemSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'tenant_supplement_stacks',
  },
);

/**
 * Returns the tenant-bound supplement-stack model.
 * @param tenantDbName - Tenant database name resolved for the active user.
 * @returns A supplement-stack model scoped to the tenant database.
 */
export async function getTenantSupplementStackModel(
  tenantDbName: string,
): Promise<Model<TenantSupplementStack>> {
  const connection = await getTenantDbConnection(tenantDbName);
  const existingModel = connection.models.TenantSupplementStack as
    | Model<TenantSupplementStack>
    | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('context')) &&
      Boolean(existingModel.schema.path('items.variantName')) &&
      Boolean(existingModel.schema.path('isFavorite'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantSupplementStack');
  }

  return connection.model<TenantSupplementStack>(
    'TenantSupplementStack',
    tenantSupplementStackSchema,
  );
}
