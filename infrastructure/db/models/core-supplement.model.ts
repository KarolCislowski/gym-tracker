import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getCoreDbConnection } from '../mongoose.client';
import type { CoreSupplement } from './core-supplement.types';

export type CoreSupplementDocument = HydratedDocument<CoreSupplement>;

const supplementVariantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    form: {
      type: String,
      required: true,
      enum: ['powder', 'capsule', 'tablet', 'liquid', 'softgel', 'other'],
    },
    compoundType: {
      type: String,
      required: true,
      enum: [
        'monohydrate',
        'malate',
        'hcl',
        'isolate',
        'concentrate',
        'citrate',
        'glycinate',
        'bisglycinate',
        'carbonate',
        'standardized_extract',
        'other',
      ],
    },
    typicalDose: {
      type: String,
      required: true,
      trim: true,
    },
    timing: {
      type: [String],
      required: true,
      default: [],
    },
    notes: {
      type: [String],
      required: false,
      default: undefined,
    },
    isDefault: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  { _id: true },
);

const coreSupplementSchema = new Schema<CoreSupplement>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    aliases: {
      type: [String],
      required: false,
      default: undefined,
    },
    category: {
      type: String,
      required: true,
      enum: ['performance', 'recovery', 'health', 'hydration', 'body_composition'],
    },
    evidenceLevel: {
      type: String,
      required: true,
      enum: ['strong', 'moderate', 'emerging', 'limited'],
    },
    description: {
      type: String,
      required: false,
      default: undefined,
    },
    goals: {
      type: [String],
      required: false,
      default: undefined,
    },
    benefits: {
      type: [String],
      required: false,
      default: undefined,
    },
    cautions: {
      type: [String],
      required: false,
      default: undefined,
    },
    tags: {
      type: [String],
      required: false,
      default: undefined,
    },
    variants: {
      type: [supplementVariantSchema],
      required: true,
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'supplements',
  },
);

/**
 * Returns the shared Core supplement model used by the supplement atlas.
 * @returns A Core supplement model bound to the shared Core connection.
 * @remarks The collection stores atlas-level supplement definitions rather than tenant-specific plans.
 */
export async function getCoreSupplementModel(): Promise<Model<CoreSupplement>> {
  const connection = await getCoreDbConnection();

  return (
    (connection.models.CoreSupplement as Model<CoreSupplement> | undefined) ??
    connection.model<CoreSupplement>('CoreSupplement', coreSupplementSchema)
  );
}
