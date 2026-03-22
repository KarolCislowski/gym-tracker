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

  return exercises.map((exercise) => ({
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
      bodyPosition: variant.bodyPosition ?? undefined,
      limbMode: variant.limbMode ?? undefined,
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
  }));
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
