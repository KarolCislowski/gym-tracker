import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

export interface UpdateProfileInput {
  tenantDbName: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  unitSystem: UnitSystem;
  heightCm: number | null;
  heightFeet: number | null;
  heightInches: number | null;
  gender: 'female' | 'male' | 'other' | 'prefer_not_to_say' | null;
  activityLevel:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extra_active'
    | null;
}

export interface UpdateProfileRecordInput {
  tenantDbName: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  heightCm: number | null;
  gender: 'female' | 'male' | 'other' | 'prefer_not_to_say' | null;
  activityLevel:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extra_active'
    | null;
}
