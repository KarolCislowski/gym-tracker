import { describe, expect, test, vi } from 'vitest';

import { createWorkoutSession } from './workout.service';

vi.mock('../infrastructure/workout.db', () => ({
  createTenantWorkoutSessionRecord: vi.fn(),
}));

import { createTenantWorkoutSessionRecord } from '../infrastructure/workout.db';

const mockedCreateTenantWorkoutSessionRecord = vi.mocked(
  createTenantWorkoutSessionRecord,
);

describe('workout.service', () => {
  /**
   * Verifies that a validated workout session is forwarded to persistence intact.
   */
  test('createWorkoutSession persists the validated workout payload', async () => {
    const performedAt = new Date('2026-03-22T12:00:00.000Z');

    await createWorkoutSession({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      workoutName: 'Push Day',
      durationMinutes: 55,
      performedAt,
      notes: 'Heavy top sets',
      exerciseEntries: [
        {
          exerciseId: 'exercise-1',
          variantId: 'variant-1',
          selectedEquipment: ['barbell', 'bench'],
          selectedGrip: 'pronated',
          selectedStance: null,
          selectedAttachment: null,
          notes: 'Pause on chest',
          sets: [
            {
              order: 1,
              reps: 5,
              weight: 100,
              durationSec: null,
              distanceMeters: null,
              rpe: 8,
              rir: 2,
              isWarmup: false,
              isFailure: false,
            },
          ],
        },
      ],
    });

    expect(mockedCreateTenantWorkoutSessionRecord).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      workoutName: 'Push Day',
      durationMinutes: 55,
      performedAt,
      notes: 'Heavy top sets',
      exerciseEntries: [
        {
          exerciseId: 'exercise-1',
          variantId: 'variant-1',
          selectedEquipment: ['barbell', 'bench'],
          selectedGrip: 'pronated',
          selectedStance: null,
          selectedAttachment: null,
          notes: 'Pause on chest',
          sets: [
            {
              order: 1,
              reps: 5,
              weight: 100,
              durationSec: null,
              distanceMeters: null,
              rpe: 8,
              rir: 2,
              isWarmup: false,
              isFailure: false,
            },
          ],
        },
      ],
    });
  });
});
