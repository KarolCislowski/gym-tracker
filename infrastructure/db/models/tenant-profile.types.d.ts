import type { Types } from 'mongoose';

export interface TenantProfile {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}
