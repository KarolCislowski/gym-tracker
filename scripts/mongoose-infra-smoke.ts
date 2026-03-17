import { closeMongooseRootConnection } from '@/infrastructure/db/mongoose.client';
import { getCoreUserModel } from '@/infrastructure/db/models/core-user.model';
import { getTenantWorkoutModel } from '@/infrastructure/db/models/tenant-workout.model';

async function run(): Promise<void> {
  const CoreUserModel = await getCoreUserModel();
  const tenantDatabaseName = `tenant_infra_smoke_${Date.now()}`;

  const coreUser = await CoreUserModel.create({
    email: `infra-smoke-${Date.now()}@gymtracker.dev`,
    tenantDatabaseName,
  });

  const TenantWorkoutModel = await getTenantWorkoutModel(
    coreUser.tenantDatabaseName,
  );

  const tenantWorkout = await TenantWorkoutModel.create({
    userId: coreUser.id,
    workoutName: 'Infra Smoke Workout',
    durationMinutes: 35,
    performedAt: new Date(),
  });

  const storedCoreUser = await CoreUserModel.findById(coreUser.id).lean();
  const storedTenantWorkout = await TenantWorkoutModel.findById(
    tenantWorkout.id,
  ).lean();

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        coreDatabase: CoreUserModel.db.name,
        tenantDatabase: TenantWorkoutModel.db.name,
        coreUserEmail: storedCoreUser?.email ?? null,
        tenantWorkoutName: storedTenantWorkout?.workoutName ?? null,
      },
      null,
      2,
    ),
  );
}

run()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongooseRootConnection();
  });
