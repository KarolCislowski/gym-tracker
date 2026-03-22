import { getCoreExerciseModel } from '@/infrastructure/db/models/core-exercise.model';

import type {
  AttachmentType,
  EquipmentType,
  Exercise,
  ExerciseDifficulty,
  ExerciseGoal,
  ExerciseMuscleActivation,
  ExerciseType,
  GripType,
  MovementPattern,
  StanceType,
  TrackableMetric,
} from '../domain/exercise.types';

/**
 * Loads all exercise definitions from the shared Core atlas.
 * @returns A promise resolving to mapped atlas exercises.
 */
export async function findExercises(): Promise<Exercise[]> {
  const CoreExerciseModel = await getCoreExerciseModel();
  const exercises = await CoreExerciseModel.find().lean();

  return exercises.map(mapExercise);
}

/**
 * Loads a single exercise definition from the shared Core atlas by slug.
 * @param slug - Stable exercise slug.
 * @returns A mapped exercise definition or `null` when it does not exist.
 */
export async function findExerciseBySlug(slug: string): Promise<Exercise | null> {
  const CoreExerciseModel = await getCoreExerciseModel();
  const exercise = await CoreExerciseModel.findOne({ slug }).lean();

  return exercise ? mapExercise(exercise) : null;
}

function mapExercise(exercise: Awaited<ReturnType<typeof getCoreExerciseModel>> extends never ? never : {
  _id: { toString(): string };
  name: string;
  slug: string;
  aliases?: string[];
  type: string;
  movementPattern: string;
  difficulty: string;
  muscles: Array<{
    activationLevel: number;
    muscleGroupId: string;
    role: 'primary' | 'secondary' | 'stabilizer';
  }>;
  description?: string;
  instructions?: string[];
  tips?: string[];
  commonMistakes?: string[];
  variants?: Array<{
    _id: { toString(): string };
    name: string;
    slug: string;
    equipment: string[];
    gripOptions?: string[];
    stanceOptions?: string[];
    attachmentOptions?: string[];
    bodyPosition?: string;
    limbMode?: string;
    musclesOverride?: Array<{
      activationLevel: number;
      muscleGroupId: string;
      role: 'primary' | 'secondary' | 'stabilizer';
    }>;
    difficultyOverride?: string;
    executionNotes?: string[];
    trackableMetrics: string[];
    isDefault?: boolean;
  }>;
  tags?: string[];
  goals?: string[];
  isActive: boolean;
}): Exercise {
  return {
    id: exercise._id.toString(),
    name: exercise.name,
    slug: exercise.slug,
    aliases: exercise.aliases ?? undefined,
    type: exercise.type as ExerciseType,
    movementPattern: exercise.movementPattern as MovementPattern,
    difficulty: exercise.difficulty as ExerciseDifficulty,
    muscles: mapMuscles(exercise.muscles),
    description: exercise.description ?? undefined,
    instructions: exercise.instructions ?? undefined,
    tips: exercise.tips ?? undefined,
    commonMistakes: exercise.commonMistakes ?? undefined,
    variants: (exercise.variants ?? []).map((variant) => ({
      id: variant._id.toString(),
      name: variant.name,
      slug: variant.slug,
      equipment: variant.equipment as EquipmentType[],
      gripOptions: variant.gripOptions as GripType[] | undefined,
      stanceOptions: variant.stanceOptions as StanceType[] | undefined,
      attachmentOptions:
        variant.attachmentOptions as AttachmentType[] | undefined,
      bodyPosition: variant.bodyPosition as
        | 'standing'
        | 'seated'
        | 'lying_flat'
        | 'incline'
        | 'decline'
        | 'kneeling'
        | 'hanging'
        | undefined,
      limbMode: variant.limbMode as
        | 'bilateral'
        | 'unilateral'
        | 'alternating'
        | undefined,
      musclesOverride: variant.musclesOverride
        ? mapMuscles(variant.musclesOverride)
        : undefined,
      difficultyOverride:
        (variant.difficultyOverride as ExerciseDifficulty | undefined) ??
        undefined,
      executionNotes: variant.executionNotes ?? undefined,
      trackableMetrics: variant.trackableMetrics as TrackableMetric[],
      isDefault: variant.isDefault ?? undefined,
    })),
    tags: exercise.tags ?? undefined,
    goals: exercise.goals as ExerciseGoal[] | undefined,
    isActive: exercise.isActive,
  };
}

function mapMuscles(
  muscles: Array<{
    activationLevel: number;
    muscleGroupId: string;
    role: 'primary' | 'secondary' | 'stabilizer';
  }>,
): ExerciseMuscleActivation[] {
  return muscles.map((muscle) => ({
    muscleGroupId: muscle.muscleGroupId,
    role: muscle.role,
    activationLevel: muscle.activationLevel,
  }));
}
