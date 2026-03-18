import type { Types } from 'mongoose';

export interface TenantMetadata {
  _id: Types.ObjectId;
  tenantDbName: string;
  createdAt: Date;
}
