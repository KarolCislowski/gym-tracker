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
    startedAt: new Date(),
    endedAt: new Date(),
    durationMinutes: 45,
    performedAt: new Date(),
    notes: 'Seeded example workout session.',
    locationSnapshot: null,
    weatherSnapshot: null,
    blocks: [
      {
        order: 1,
        type: 'single',
        name: 'Main lift',
        rounds: null,
        restAfterBlockSec: 180,
        entries: [
          {
            order: 1,
            exerciseId: 'bench-press',
            exerciseSlug: 'bench-press',
            variantId: 'barbell-bench-press',
            selectedEquipment: ['barbell', 'bench'],
            selectedGrip: 'pronated',
            selectedStance: null,
            selectedAttachment: null,
            notes: 'Controlled eccentric.',
            restAfterEntrySec: 180,
            sets: [
              {
                order: 1,
                reps: 8,
                weight: 80,
                durationSec: null,
                distanceMeters: null,
                calories: null,
                rpe: 7.5,
                rir: 2,
                isWarmup: false,
                isFailure: false,
                setKind: 'normal',
                parentSetOrder: null,
                completedAt: new Date(),
              },
            ],
          },
        ],
      },
    ],
  });
}
