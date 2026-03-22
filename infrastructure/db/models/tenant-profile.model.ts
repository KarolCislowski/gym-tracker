import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantProfile } from './tenant-profile.types';

export type TenantProfileDocument = HydratedDocument<TenantProfile>;

const tenantProfileSchema = new Schema<TenantProfile>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: false,
      default: null,
    },
    favoriteExerciseSlugs: {
      type: [String],
      required: false,
      default: [],
    },
    heightCm: {
      type: Number,
      required: false,
      min: 30,
      max: 300,
      default: null,
    },
    gender: {
      type: String,
      required: false,
      enum: ['female', 'male', 'other', 'prefer_not_to_say'],
      default: null,
    },
    activityLevel: {
      type: String,
      required: false,
      enum: [
        'sedentary',
        'lightly_active',
        'moderately_active',
        'very_active',
        'extra_active',
      ],
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    collection: 'profiles',
  },
);

/**
 * Returns the TenantProfile model bound to a specific tenant database.
 */
export async function getTenantProfileModel(
  tenantDbName: string,
): Promise<Model<TenantProfile>> {
  const connection = await getTenantDbConnection(tenantDbName);
  const existingModel = connection.models.TenantProfile as Model<TenantProfile> | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('birthDate')) &&
      Boolean(existingModel.schema.path('favoriteExerciseSlugs')) &&
      Boolean(existingModel.schema.path('heightCm')) &&
      Boolean(existingModel.schema.path('activityLevel'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    // Refresh the cached model in development after schema changes so new fields are not ignored.
    connection.deleteModel('TenantProfile');
  }

  return connection.model<TenantProfile>('TenantProfile', tenantProfileSchema);
}
