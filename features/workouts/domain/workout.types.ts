import type {
  AttachmentType,
  EquipmentType,
  GripType,
  StanceType,
} from '@/features/exercises/domain/exercise.types';

export interface ExerciseSetInput {
  order: number;
  reps: number | null;
  weight: number | null;
  durationSec: number | null;
  distanceMeters: number | null;
  rpe: number | null;
  rir: number | null;
  isWarmup: boolean;
  isFailure: boolean;
}

export interface ExerciseEntryInput {
  exerciseId: string;
  variantId: string | null;
  selectedEquipment: EquipmentType[];
  selectedGrip: GripType | null;
  selectedStance: StanceType | null;
  selectedAttachment: AttachmentType | null;
  notes: string | null;
  sets: ExerciseSetInput[];
}

export interface CreateWorkoutSessionInput {
  tenantDbName: string;
  userId: string;
  workoutName: string;
  durationMinutes: number;
  performedAt: Date;
  notes: string | null;
  exerciseEntries: ExerciseEntryInput[];
}

export interface CreateWorkoutSessionRecordInput {
  userId: string;
  workoutName: string;
  durationMinutes: number;
  performedAt: Date;
  notes: string | null;
  exerciseEntries: ExerciseEntryInput[];
}
