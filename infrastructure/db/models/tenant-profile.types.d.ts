import type { Types } from 'mongoose';

export interface TenantProfileLocation {
  provider: 'google_places';
  placeId: string;
  displayName: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  countryCode?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  locality?: string | null;
  postalCode?: string | null;
}

export interface TenantProfile {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: Date | null;
  favoriteExerciseSlugs?: string[];
  location?: TenantProfileLocation | null;
  heightCm?: number | null;
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
