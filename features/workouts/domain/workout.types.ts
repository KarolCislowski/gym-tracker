import type {
  AttachmentType,
  EquipmentType,
  GripType,
  TrackableMetric,
  StanceType,
} from '@/features/exercises/domain/exercise.types';
import type { ProfileLocationInput } from '@/features/profile/domain/profile.types';

/**
 * Weather context captured for a workout session when outdoor or contextual data is available.
 */
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

/**
 * Logged set data for a single exercise entry inside a workout report.
 */
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

/**
 * Logged exercise entry carrying variant choices, notes, rest, and performed sets.
 */
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

/**
 * Structured workout block grouping one or more exercise entries.
 */
export interface WorkoutBlockInput {
  order: number;
  type: 'single' | 'superset' | 'circuit' | 'dropset';
  name: string | null;
  rounds: number | null;
  restAfterBlockSec: number | null;
  entries: ExerciseEntryInput[];
}

/**
 * Template-level exercise entry without performed set data.
 */
export interface WorkoutTemplateEntryInput {
  order: number;
  exerciseId: string;
  exerciseSlug: string;
  variantId: string | null;
  selectedGrip: GripType | null;
  selectedStance: StanceType | null;
  selectedAttachment: AttachmentType | null;
  notes: string | null;
  restAfterEntrySec: number | null;
}

/**
 * Template-level workout block used when saving reusable workout structures.
 */
export interface WorkoutTemplateBlockInput {
  order: number;
  type: 'single' | 'superset' | 'circuit' | 'dropset';
  name: string | null;
  rounds: number | null;
  restAfterBlockSec: number | null;
  entries: WorkoutTemplateEntryInput[];
}

/**
 * Full payload used when creating a persisted workout session.
 */
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

/**
 * Update payload for an existing workout session.
 */
export interface UpdateWorkoutSessionInput extends CreateWorkoutSessionInput {
  reportId: string;
}

/**
 * Full payload used when creating a reusable workout template.
 */
export interface CreateWorkoutTemplateInput {
  tenantDbName: string;
  userId: string;
  name: string;
  notes: string | null;
  blocks: WorkoutTemplateBlockInput[];
}

/**
 * Update payload for an existing workout template.
 */
export interface UpdateWorkoutTemplateInput extends CreateWorkoutTemplateInput {
  templateId: string;
}

/**
 * Persistence-facing workout template payload without tenant metadata.
 */
export interface CreateWorkoutTemplateRecordInput {
  userId: string;
  name: string;
  notes: string | null;
  blocks: WorkoutTemplateBlockInput[];
}

/**
 * Persistence-facing workout session payload without tenant metadata.
 */
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

/**
 * Lightweight workout-session projection used in history lists and dashboard context.
 */
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

/**
 * Fully expanded workout-session projection used by report details and editing flows.
 */
export interface WorkoutSessionDetails {
  id: string;
  workoutName: string;
  startedAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;
  performedAt: string;
  notes: string | null;
  locationSnapshot: ProfileLocationInput | null;
  weatherSnapshot: WorkoutWeatherSnapshotInput | null;
  blocks: WorkoutBlockInput[];
}

/**
 * Prefilled workout draft produced when duplicating an existing report into a new create flow.
 */
export interface WorkoutSessionDuplicateDraft {
  workoutName: string;
  startedAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;
  performedAt: string;
  notes: string | null;
  weatherSnapshot: WorkoutWeatherSnapshotInput | null;
  blocks: WorkoutBlockInput[];
}

/**
 * Aggregated analytics entry representing one exercised movement inside a session.
 */
export interface WorkoutSessionAnalyticsEntry {
  exerciseSlug: string;
  variantId: string | null;
  setCount: number;
}

/**
 * Analytics-oriented workout-session projection used to build dashboard volume trends.
 */
export interface WorkoutSessionAnalytics {
  id: string;
  performedAt: string;
  entries: WorkoutSessionAnalyticsEntry[];
}

/**
 * Lightweight workout-template projection used in lists and quick-start flows.
 */
export interface WorkoutTemplateSummary {
  id: string;
  name: string;
  notes: string | null;
  blockCount: number;
  exerciseCount: number;
  blocks: WorkoutTemplateBlockInput[];
}
