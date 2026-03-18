import { getCoreUserModel } from './core-user.model';
import { getTenantWorkoutModel } from './tenant-workout.model';

/**
 * Example helper that creates a user in the Core database
 * and then stores a workout in that user's tenant database.
 */
export async function seedExampleData(): Promise<void> {
  const CoreUserModel = await getCoreUserModel();

  const coreUser = await CoreUserModel.create({
    email: 'demo@gymtracker.dev',
    password: 'placeholder-hash',
    isActive: true,
    tenantDbName: 'tenant_demo_user',
  });

  const TenantWorkoutModel = await getTenantWorkoutModel(coreUser.tenantDbName);

  await TenantWorkoutModel.create({
    userId: coreUser.id,
    workoutName: 'Push Day',
    durationMinutes: 45,
    performedAt: new Date(),
  });
}
