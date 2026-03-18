import type { Types } from 'mongoose';

export interface TenantSettings {
  _id: Types.ObjectId;
  scope: 'tenant';
  language: string;
  isDarkMode: boolean;
  createdAt: Date;
}
