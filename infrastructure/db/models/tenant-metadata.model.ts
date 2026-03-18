import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantMetadata } from './tenant-metadata.types';

export type TenantMetadataDocument = HydratedDocument<TenantMetadata>;

const tenantMetadataSchema = new Schema<TenantMetadata>(
  {
    tenantDbName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    collection: 'tenant_metadata',
  },
);

/**
 * Returns the TenantMetadata model bound to a specific tenant database.
 */
export async function getTenantMetadataModel(
  tenantDbName: string,
): Promise<Model<TenantMetadata>> {
  const connection = await getTenantDbConnection(tenantDbName);

  return (
    (connection.models.TenantMetadata as Model<TenantMetadata> | undefined) ??
    connection.model<TenantMetadata>('TenantMetadata', tenantMetadataSchema)
  );
}
