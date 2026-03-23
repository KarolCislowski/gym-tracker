import type {
  AttachmentType,
  EquipmentType,
  GripType,
  TrackableMetric,
  StanceType,
} from '@/features/exercises/domain/exercise.types';
import type { ProfileLocationInput } from '@/features/profile/domain/profile.types';

export interface WorkoutWeatherSnapshotInput {
  provider: string;
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  humidityPercent: number | null;
  windSpeedKph: number | null;
  precipitationMm: number | null;
  weatherCode: string | null;
  capturedAt: Date;
}

export interface ExerciseSetInput {
  order: number;
  reps: number | null;
  weight: number | null;
  durationSec: number | null;
  distanceMeters: number | null;
  calories: number | null;
  rpe: number | null;
  rir: number | null;
  isWarmup: boolean;
  isFailure: boolean;
  setKind: 'normal' | 'drop' | 'backoff' | 'top';
  parentSetOrder: number | null;
  completedAt: Date | null;
}

export interface ExerciseEntryInput {
  order: number;
  exerciseId: string;
  exerciseSlug: string;
  variantId: string | null;
  trackableMetrics: TrackableMetric[];
  selectedEquipment: EquipmentType[];
  selectedGrip: GripType | null;
  selectedStance: StanceType | null;
  selectedAttachment: AttachmentType | null;
  notes: string | null;
  restAfterEntrySec: number | null;
  sets: ExerciseSetInput[];
}

export interface WorkoutBlockInput {
  order: number;
  type: 'single' | 'superset' | 'circuit' | 'dropset';
  name: string | null;
  rounds: number | null;
  restAfterBlockSec: number | null;
  entries: ExerciseEntryInput[];
}

export interface CreateWorkoutSessionInput {
  tenantDbName: string;
  userId: string;
  workoutName: string;
  startedAt: Date | null;
  endedAt: Date | null;
  durationMinutes: number | null;
  performedAt: Date;
  notes: string | null;
  locationSnapshot: ProfileLocationInput | null;
  weatherSnapshot: WorkoutWeatherSnapshotInput | null;
  blocks: WorkoutBlockInput[];
}

export interface CreateWorkoutSessionRecordInput {
  userId: string;
  workoutName: string;
  startedAt: Date | null;
  endedAt: Date | null;
  durationMinutes: number | null;
  performedAt: Date;
  notes: string | null;
  locationSnapshot: ProfileLocationInput | null;
  weatherSnapshot: WorkoutWeatherSnapshotInput | null;
  blocks: WorkoutBlockInput[];
}

export interface WorkoutSessionSummary {
  id: string;
  workoutName: string;
  performedAt: string;
  durationMinutes: number | null;
  notes: string | null;
  blockCount: number;
  exerciseCount: number;
  setCount: number;
}

export interface WorkoutSessionAnalyticsEntry {
  exerciseSlug: string;
  variantId: string | null;
  setCount: number;
}

export interface WorkoutSessionAnalytics {
  id: string;
  performedAt: string;
  entries: WorkoutSessionAnalyticsEntry[];
}
