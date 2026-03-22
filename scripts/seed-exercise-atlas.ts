import { exerciseAtlasExercises, exerciseAtlasMuscleGroups } from '@/features/exercises/infrastructure/exercise-atlas.seed';
import { getCoreExerciseModel } from '@/infrastructure/db/models/core-exercise.model';
import { getCoreMuscleGroupModel } from '@/infrastructure/db/models/core-muscle-group.model';
import { closeMongooseRootConnection } from '@/infrastructure/db/mongoose.client';

async function seedExerciseAtlas(): Promise<void> {
  const CoreMuscleGroupModel = await getCoreMuscleGroupModel();
  const CoreExerciseModel = await getCoreExerciseModel();

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

seedExerciseAtlas()
  .catch((error) => {
    console.error('Failed to seed exercise atlas:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongooseRootConnection();
  });
