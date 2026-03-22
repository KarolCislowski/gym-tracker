export interface TenantWorkoutSet {
  order: number;
  reps?: number | null;
  weight?: number | null;
  durationSec?: number | null;
  distanceMeters?: number | null;
  rpe?: number | null;
  rir?: number | null;
  isWarmup: boolean;
  isFailure: boolean;
}

export interface TenantWorkoutExerciseEntry {
  exerciseId: string;
  variantId?: string | null;
  selectedEquipment: string[];
  selectedGrip?: string | null;
  selectedStance?: string | null;
  selectedAttachment?: string | null;
  notes?: string | null;
  sets: TenantWorkoutSet[];
}

export interface TenantWorkout {
  userId: string;
  workoutName: string;
  durationMinutes: number;
  performedAt: Date;
  notes?: string | null;
  exerciseEntries: TenantWorkoutExerciseEntry[];
  createdAt: Date;
  updatedAt: Date;
}
