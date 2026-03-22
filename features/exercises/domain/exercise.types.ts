export type ExerciseType = 'compound' | 'isolation';

export type MovementPattern =
  | 'push'
  | 'pull'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'rotation'
  | 'carry'
  | 'other';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseGoal = 'strength' | 'hypertrophy' | 'endurance' | 'rehab';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'smith_machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance_band'
  | 'ez_bar'
  | 'trap_bar'
  | 'bench'
  | 'pull_up_bar'
  | 'other';

export type GripType =
  | 'pronated'
  | 'supinated'
  | 'neutral'
  | 'mixed'
  | 'wide'
  | 'narrow'
  | 'shoulder_width'
  | 'rope'
  | 'reverse';

export type StanceType =
  | 'narrow'
  | 'shoulder_width'
  | 'wide'
  | 'split_stance'
  | 'staggered'
  | 'sumo'
  | 'neutral';

export type AttachmentType =
  | 'rope'
  | 'straight_bar'
  | 'ez_bar'
  | 'single_handle'
  | 'double_handle'
  | 'ankle_strap'
  | 'v_bar'
  | 'lat_bar'
  | 'other';

export type TrackableMetric =
  | 'weight'
  | 'reps'
  | 'duration'
  | 'distance'
  | 'calories'
  | 'rpe'
  | 'rir';

export interface ExerciseMuscleActivation {
  muscleGroupId: string;
  role: 'primary' | 'secondary' | 'stabilizer';
  activationLevel: number;
}

export interface ExerciseVariant {
  id: string;
  name: string;
  slug: string;
  equipment: EquipmentType[];
  gripOptions?: GripType[];
  stanceOptions?: StanceType[];
  attachmentOptions?: AttachmentType[];
  bodyPosition?:
    | 'standing'
    | 'seated'
    | 'lying_flat'
    | 'incline'
    | 'decline'
    | 'kneeling'
    | 'hanging';
  limbMode?: 'bilateral' | 'unilateral' | 'alternating';
  musclesOverride?: ExerciseMuscleActivation[];
  difficultyOverride?: ExerciseDifficulty;
  executionNotes?: string[];
  trackableMetrics: TrackableMetric[];
  isDefault?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  aliases?: string[];
  type: ExerciseType;
  movementPattern: MovementPattern;
  difficulty: ExerciseDifficulty;
  muscles: ExerciseMuscleActivation[];
  description?: string;
  instructions?: string[];
  tips?: string[];
  commonMistakes?: string[];
  variants: ExerciseVariant[];
  tags?: string[];
  goals?: ExerciseGoal[];
  isActive: boolean;
}

export interface ExerciseAtlasFilters {
  equipment?: EquipmentType;
  goal?: ExerciseGoal;
  muscleGroupId?: string;
  search?: string;
}
