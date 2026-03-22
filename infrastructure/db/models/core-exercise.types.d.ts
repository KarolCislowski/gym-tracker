import type { Types } from 'mongoose';

export interface CoreExerciseMuscleActivation {
  muscleGroupId: string;
  role: 'primary' | 'secondary' | 'stabilizer';
  activationLevel: number;
}

export interface CoreExerciseVariant {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  equipment: string[];
  gripOptions?: string[];
  stanceOptions?: string[];
  attachmentOptions?: string[];
  bodyPosition?:
    | 'standing'
    | 'seated'
    | 'lying_flat'
    | 'incline'
    | 'decline'
    | 'kneeling'
    | 'hanging';
  limbMode?: 'bilateral' | 'unilateral' | 'alternating';
  musclesOverride?: CoreExerciseMuscleActivation[];
  difficultyOverride?: 'beginner' | 'intermediate' | 'advanced';
  executionNotes?: string[];
  trackableMetrics: string[];
  isDefault?: boolean;
}

export interface CoreExercise {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  aliases?: string[];
  type: 'compound' | 'isolation';
  movementPattern:
    | 'push'
    | 'pull'
    | 'squat'
    | 'hinge'
    | 'lunge'
    | 'rotation'
    | 'carry'
    | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscles: CoreExerciseMuscleActivation[];
  description?: string;
  instructions?: string[];
  tips?: string[];
  commonMistakes?: string[];
  variants: CoreExerciseVariant[];
  tags?: string[];
  goals?: ('strength' | 'hypertrophy' | 'endurance' | 'rehab')[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
