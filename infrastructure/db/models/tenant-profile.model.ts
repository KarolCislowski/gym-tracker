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

  return (
    (connection.models.TenantProfile as Model<TenantProfile> | undefined) ??
    connection.model<TenantProfile>('TenantProfile', tenantProfileSchema)
  );
}
