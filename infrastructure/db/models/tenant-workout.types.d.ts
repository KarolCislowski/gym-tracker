export interface TenantWorkoutWeatherSnapshot {
  provider: string;
  temperatureC: number | null;
  apparentTemperatureC?: number | null;
  humidityPercent?: number | null;
  windSpeedKph?: number | null;
  precipitationMm?: number | null;
  weatherCode?: string | null;
  capturedAt: Date;
}

export interface TenantWorkoutLocationSnapshot {
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

export interface TenantWorkoutSet {
  order: number;
  reps?: number | null;
  weight?: number | null;
  durationSec?: number | null;
  distanceMeters?: number | null;
  calories?: number | null;
  rpe?: number | null;
  rir?: number | null;
  isWarmup: boolean;
  isFailure: boolean;
  setKind: 'normal' | 'drop' | 'backoff' | 'top';
  parentSetOrder?: number | null;
  completedAt?: Date | null;
}

export interface TenantWorkoutExerciseEntry {
  order: number;
  exerciseId: string;
  exerciseSlug: string;
  variantId?: string | null;
  selectedEquipment: string[];
  selectedGrip?: string | null;
  selectedStance?: string | null;
  selectedAttachment?: string | null;
  notes?: string | null;
  restAfterEntrySec?: number | null;
  sets: TenantWorkoutSet[];
}

export interface TenantWorkoutBlock {
  order: number;
  type: 'single' | 'superset' | 'circuit' | 'dropset';
  name?: string | null;
  rounds?: number | null;
  restAfterBlockSec?: number | null;
  entries: TenantWorkoutExerciseEntry[];
}

export interface TenantWorkout {
  userId: string;
  workoutName: string;
  startedAt?: Date | null;
  endedAt?: Date | null;
  durationMinutes?: number | null;
  performedAt: Date;
  notes?: string | null;
  locationSnapshot?: TenantWorkoutLocationSnapshot | null;
  weatherSnapshot?: TenantWorkoutWeatherSnapshot | null;
  blocks: TenantWorkoutBlock[];
  createdAt: Date;
  updatedAt: Date;
}
