import type { Types } from 'mongoose';

export interface TenantProfile {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number | null;
  gender?: 'female' | 'male' | 'other' | 'prefer_not_to_say' | null;
  activityLevel?:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extra_active'
    | null;
  createdAt: Date;
}
