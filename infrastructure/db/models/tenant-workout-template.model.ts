import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantWorkoutTemplate } from './tenant-workout-template.types';

export type TenantWorkoutTemplateDocument =
  HydratedDocument<TenantWorkoutTemplate>;

const tenantWorkoutTemplateEntrySchema = new Schema(
  {
    order: { type: Number, required: true, min: 1 },
    exerciseId: { type: String, required: true, trim: true },
    exerciseSlug: { type: String, required: true, trim: true },
    variantId: { type: String, required: false, default: null },
    selectedGrip: { type: String, required: false, default: null },
    selectedStance: { type: String, required: false, default: null },
    selectedAttachment: { type: String, required: false, default: null },
    notes: { type: String, required: false, default: null },
    restAfterEntrySec: { type: Number, required: false, min: 0, default: null },
  },
  { _id: false },
);

const tenantWorkoutTemplateBlockSchema = new Schema(
  {
    order: { type: Number, required: true, min: 1 },
    type: {
      type: String,
      required: true,
      enum: ['single', 'superset', 'circuit', 'dropset'],
    },
    name: { type: String, required: false, default: null },
    rounds: { type: Number, required: false, min: 1, default: null },
    restAfterBlockSec: { type: Number, required: false, min: 0, default: null },
    entries: {
      type: [tenantWorkoutTemplateEntrySchema],
      required: true,
      default: [],
    },
  },
  { _id: false },
);

const tenantWorkoutTemplateSchema = new Schema<TenantWorkoutTemplate>(
  {
    userId: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    notes: { type: String, required: false, default: null },
    blocks: {
      type: [tenantWorkoutTemplateBlockSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'tenant_workout_templates',
  },
);

/**
 * Returns the TenantWorkoutTemplate model bound to a specific tenant database.
 */
export async function getTenantWorkoutTemplateModel(
  tenantDbName: string,
): Promise<Model<TenantWorkoutTemplate>> {
  const connection = await getTenantDbConnection(tenantDbName);
  const existingModel = connection.models.TenantWorkoutTemplate as
    | Model<TenantWorkoutTemplate>
    | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('notes')) &&
      Boolean(existingModel.schema.path('blocks.entries.restAfterEntrySec'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantWorkoutTemplate');
  }

  return connection.model<TenantWorkoutTemplate>(
    'TenantWorkoutTemplate',
    tenantWorkoutTemplateSchema,
  );
}
