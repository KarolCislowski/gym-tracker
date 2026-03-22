import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

export interface AuthenticatedUser {
  id: string;
  email: string;
  isActive: boolean;
  tenantDbName: string;
}

export interface CredentialsInput {
  email: string;
  password: string;
}

export interface RegisterUserInput extends CredentialsInput {
  firstName: string;
  lastName: string;
  language: string;
  isDarkMode: boolean;
}

export interface CreateCoreUserRecordInput {
  email: string;
  password: string;
  tenantDbName: string;
}

export interface CreateTenantDatabaseInput {
  tenantDbName: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  isDarkMode: boolean;
}

export interface CoreUserLookupDto {
  id: string;
}

export interface CoreUserAuthDto {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  tenantDbName: string;
}

export interface CreatedCoreUserDto {
  id: string;
  email: string;
  isActive: boolean;
  tenantDbName: string;
}

export interface TenantProfileSnapshot {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  age: number | null;
  favoriteExerciseSlugs: string[];
  location: {
    provider: 'google_places';
    placeId: string;
    displayName: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    countryCode: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
    locality: string | null;
    postalCode: string | null;
  } | null;
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

export interface TenantSettingsSnapshot {
  language: string;
  isDarkMode: boolean;
  unitSystem: UnitSystem;
}

export interface TenantHealthyHabitsSnapshot {
  averageSleepHoursPerDay: number | null;
  stepsPerDay: number | null;
  waterLitersPerDay: number | null;
  proteinGramsPerDay: number | null;
  strengthWorkoutsPerWeek: number | null;
  cardioMinutesPerWeek: number | null;
  regularSleepSchedule: boolean;
}

export interface AuthenticatedUserSnapshot {
  profile: TenantProfileSnapshot | null;
  settings: TenantSettingsSnapshot | null;
  healthyHabits: TenantHealthyHabitsSnapshot | null;
  favoriteExerciseSlugs: string[];
}
