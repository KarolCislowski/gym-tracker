import { readFile } from 'node:fs/promises';

import { exerciseAtlasMuscleGroups } from '@/features/exercises/infrastructure/exercise-atlas.seed';
import { getCoreExerciseModel } from '@/infrastructure/db/models/core-exercise.model';
import { getCoreMuscleGroupModel } from '@/infrastructure/db/models/core-muscle-group.model';
import { closeMongooseRootConnection } from '@/infrastructure/db/mongoose.client';
import type { CoreExercise } from '@/infrastructure/db/models/core-exercise.types';

type SeedExerciseVariantInput = Omit<CoreExercise['variants'][number], '_id'> & {
  _id?: unknown;
};

type SeedExerciseInput = Omit<
  CoreExercise,
  '_id' | 'createdAt' | 'updatedAt' | 'variants'
> & {
  _id?: unknown;
  __v?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  variants: SeedExerciseVariantInput[];
};

async function seedExerciseAtlas(): Promise<void> {
  const CoreMuscleGroupModel = await getCoreMuscleGroupModel();
  const CoreExerciseModel = await getCoreExerciseModel();
  const exerciseAtlasExercises = await loadProductionReadyExercises();

  await CoreMuscleGroupModel.bulkWrite(
    exerciseAtlasMuscleGroups.map((muscleGroup) => ({
      updateOne: {
        filter: { slug: muscleGroup.slug },
        update: { $set: muscleGroup as Record<string, unknown> },
        upsert: true,
      },
    })),
  );

  await CoreExerciseModel.bulkWrite(
    exerciseAtlasExercises.map((exercise) => ({
      updateOne: {
        filter: { slug: exercise.slug },
        update: { $set: exercise as Record<string, unknown> },
        upsert: true,
      },
    })),
  );

  console.log(
    `Seeded ${exerciseAtlasMuscleGroups.length} muscle groups and ${exerciseAtlasExercises.length} exercises into the Core atlas.`,
  );
}

async function loadProductionReadyExercises(): Promise<SeedExerciseInput[]> {
  const rawFile = await readFile('db/exercises_production_ready.json', 'utf-8');
  const parsedFile = JSON.parse(rawFile) as SeedExerciseInput[];

  return parsedFile.map((exercise) => ({
    slug: exercise.slug,
    name: exercise.name,
    aliases: exercise.aliases,
    type: exercise.type,
    movementPattern: exercise.movementPattern,
    difficulty: exercise.difficulty,
    muscles: exercise.muscles,
    description: exercise.description,
    instructions: exercise.instructions,
    tips: exercise.tips,
    commonMistakes: exercise.commonMistakes,
    variants: exercise.variants.map((variant) => ({
      name: variant.name,
      slug: variant.slug,
      equipment: variant.equipment,
      gripOptions: variant.gripOptions,
      stanceOptions: variant.stanceOptions,
      attachmentOptions: variant.attachmentOptions,
      bodyPosition: variant.bodyPosition,
      limbMode: variant.limbMode,
      musclesOverride: variant.musclesOverride,
      difficultyOverride: variant.difficultyOverride,
      executionNotes: variant.executionNotes,
      trackableMetrics: variant.trackableMetrics,
      isDefault: variant.isDefault,
    })),
    tags: exercise.tags,
    goals: exercise.goals,
    isActive: exercise.isActive,
  }));
}

seedExerciseAtlas()
  .catch((error) => {
    console.error('Failed to seed exercise atlas:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongooseRootConnection();
  });
