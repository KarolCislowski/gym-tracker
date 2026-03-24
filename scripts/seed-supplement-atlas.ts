import { supplementAtlasSupplements } from '@/features/supplements/infrastructure/supplement-atlas.seed.full';
import { closeMongooseRootConnection } from '@/infrastructure/db/mongoose.client';
import { getCoreSupplementModel } from '@/infrastructure/db/models/core-supplement.model';

async function seedSupplementAtlas(): Promise<void> {
  const CoreSupplementModel = await getCoreSupplementModel();

  await CoreSupplementModel.bulkWrite(
    supplementAtlasSupplements.map((supplement) => ({
      updateOne: {
        filter: { slug: supplement.slug },
        update: {
          $set: {
            ...supplement,
            isActive: supplement.isActive ?? true,
          } as Record<string, unknown>,
        },
        upsert: true,
      },
    })),
  );

  console.log(
    `Seeded ${supplementAtlasSupplements.length} supplements into the Core atlas.`,
  );
}

seedSupplementAtlas()
  .catch((error) => {
    console.error('Failed to seed supplement atlas:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongooseRootConnection();
  });
