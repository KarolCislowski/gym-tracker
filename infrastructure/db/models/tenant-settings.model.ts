import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantSettings } from './tenant-settings.types';

export type TenantSettingsDocument = HydratedDocument<TenantSettings>;

const tenantSettingsSchema = new Schema<TenantSettings>(
  {
    scope: {
      type: String,
      required: true,
      enum: ['tenant'],
      unique: true,
      default: 'tenant',
    },
    language: {
      type: String,
      required: true,
      trim: true,
      default: 'en',
    },
    isDarkMode: {
      type: Boolean,
      required: true,
      default: false,
    },
    unitSystem: {
      type: String,
      required: true,
      enum: ['metric', 'imperial_us', 'imperial_uk'],
      default: 'metric',
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    collection: 'settings',
  },
);

/**
 * Returns the TenantSettings model bound to a specific tenant database.
 */
export async function getTenantSettingsModel(
  tenantDbName: string,
): Promise<Model<TenantSettings>> {
  const connection = await getTenantDbConnection(tenantDbName);

  return (
    (connection.models.TenantSettings as Model<TenantSettings> | undefined) ??
    connection.model<TenantSettings>('TenantSettings', tenantSettingsSchema)
  );
}
