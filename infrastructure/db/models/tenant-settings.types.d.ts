import type { UnitSystem } from '@/shared/units/domain/unit-system.types';
import type { Types } from 'mongoose';

export interface TenantSettings {
  _id: Types.ObjectId;
  scope: 'tenant';
  language: string;
  isDarkMode: boolean;
  unitSystem: UnitSystem;
  createdAt: Date;
}
