import { describe, expect, test, vi } from 'vitest';

import { createWorkoutSession } from './workout.service';

vi.mock('../infrastructure/workout.db', () => ({
  createTenantWorkoutSessionRecord: vi.fn(),
  listTenantWorkoutSessionRecords: vi.fn(),
}));

import {
  createTenantWorkoutSessionRecord,
  listTenantWorkoutSessionRecords,
} from '../infrastructure/workout.db';

const mockedCreateTenantWorkoutSessionRecord = vi.mocked(
  createTenantWorkoutSessionRecord,
);
const mockedListTenantWorkoutSessionRecords = vi.mocked(
  listTenantWorkoutSessionRecords,
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
      startedAt: new Date('2026-03-22T11:05:00.000Z'),
      endedAt: new Date('2026-03-22T12:00:00.000Z'),
      durationMinutes: 55,
      performedAt,
      notes: 'Heavy top sets',
      locationSnapshot: {
        provider: 'google_places',
        placeId: 'place-1',
        displayName: 'Stockholm',
        formattedAddress: 'Stockholm, Sweden',
        latitude: 59.3327,
        longitude: 18.0656,
        countryCode: 'SE',
        country: 'Sweden',
        region: 'Stockholm County',
        city: 'Stockholm',
        locality: null,
        postalCode: null,
      },
      weatherSnapshot: {
        provider: 'open-meteo',
        temperatureC: 6,
        apparentTemperatureC: 4,
        humidityPercent: 75,
        windSpeedKph: 14,
        precipitationMm: 0,
        weatherCode: 'cloudy',
        capturedAt: performedAt,
      },
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
              exerciseId: 'exercise-1',
              exerciseSlug: 'bench-press',
              variantId: 'variant-1',
              trackableMetrics: ['weight', 'reps', 'rpe', 'rir'],
              selectedEquipment: ['barbell', 'bench'],
              selectedGrip: 'pronated',
              selectedStance: null,
              selectedAttachment: null,
              notes: 'Pause on chest',
              restAfterEntrySec: 180,
              sets: [
                {
                  order: 1,
                  reps: 5,
                  weight: 100,
                  durationSec: null,
                  distanceMeters: null,
                  calories: null,
                  rpe: 8,
                  rir: 2,
                  isWarmup: false,
                  isFailure: false,
                  setKind: 'top',
                  parentSetOrder: null,
                  completedAt: performedAt,
                },
                {
                  order: 2,
                  reps: 10,
                  weight: 80,
                  durationSec: null,
                  distanceMeters: null,
                  calories: null,
                  rpe: 9,
                  rir: 1,
                  isWarmup: false,
                  isFailure: false,
                  setKind: 'drop',
                  parentSetOrder: 1,
                  completedAt: performedAt,
                },
              ],
            },
          ],
        },
        {
          order: 2,
          type: 'circuit',
          name: 'Conditioning circuit',
          rounds: 3,
          restAfterBlockSec: 90,
          entries: [
            {
              order: 1,
              exerciseId: 'exercise-2',
              exerciseSlug: 'farmer-carry',
              variantId: null,
              trackableMetrics: ['distance', 'duration'],
              selectedEquipment: ['dumbbell'],
              selectedGrip: null,
              selectedStance: null,
              selectedAttachment: null,
              notes: null,
              restAfterEntrySec: 30,
              sets: [
                {
                  order: 1,
                  reps: null,
                  weight: 32,
                  durationSec: 45,
                  distanceMeters: 40,
                  calories: null,
                  rpe: 7,
                  rir: null,
                  isWarmup: false,
                  isFailure: false,
                  setKind: 'normal',
                  parentSetOrder: null,
                  completedAt: performedAt,
                },
              ],
            },
          ],
        },
      ],
    });

    expect(mockedCreateTenantWorkoutSessionRecord).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      workoutName: 'Push Day',
      startedAt: new Date('2026-03-22T11:05:00.000Z'),
      endedAt: new Date('2026-03-22T12:00:00.000Z'),
      durationMinutes: 55,
      performedAt,
      notes: 'Heavy top sets',
      locationSnapshot: {
        provider: 'google_places',
        placeId: 'place-1',
        displayName: 'Stockholm',
        formattedAddress: 'Stockholm, Sweden',
        latitude: 59.3327,
        longitude: 18.0656,
        countryCode: 'SE',
        country: 'Sweden',
        region: 'Stockholm County',
        city: 'Stockholm',
        locality: null,
        postalCode: null,
      },
      weatherSnapshot: {
        provider: 'open-meteo',
        temperatureC: 6,
        apparentTemperatureC: 4,
        humidityPercent: 75,
        windSpeedKph: 14,
        precipitationMm: 0,
        weatherCode: 'cloudy',
        capturedAt: performedAt,
      },
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
              exerciseId: 'exercise-1',
              exerciseSlug: 'bench-press',
              variantId: 'variant-1',
              trackableMetrics: ['weight', 'reps', 'rpe', 'rir'],
              selectedEquipment: ['barbell', 'bench'],
              selectedGrip: 'pronated',
              selectedStance: null,
              selectedAttachment: null,
              notes: 'Pause on chest',
              restAfterEntrySec: 180,
              sets: [
                {
                  order: 1,
                  reps: 5,
                  weight: 100,
                  durationSec: null,
                  distanceMeters: null,
                  calories: null,
                  rpe: 8,
                  rir: 2,
                  isWarmup: false,
                  isFailure: false,
                  setKind: 'top',
                  parentSetOrder: null,
                  completedAt: performedAt,
                },
                {
                  order: 2,
                  reps: 10,
                  weight: 80,
                  durationSec: null,
                  distanceMeters: null,
                  calories: null,
                  rpe: 9,
                  rir: 1,
                  isWarmup: false,
                  isFailure: false,
                  setKind: 'drop',
                  parentSetOrder: 1,
                  completedAt: performedAt,
                },
              ],
            },
          ],
        },
        {
          order: 2,
          type: 'circuit',
          name: 'Conditioning circuit',
          rounds: 3,
          restAfterBlockSec: 90,
          entries: [
            {
              order: 1,
              exerciseId: 'exercise-2',
              exerciseSlug: 'farmer-carry',
              variantId: null,
              trackableMetrics: ['distance', 'duration'],
              selectedEquipment: ['dumbbell'],
              selectedGrip: null,
              selectedStance: null,
              selectedAttachment: null,
              notes: null,
              restAfterEntrySec: 30,
              sets: [
                {
                  order: 1,
                  reps: null,
                  weight: 32,
                  durationSec: 45,
                  distanceMeters: 40,
                  calories: null,
                  rpe: 7,
                  rir: null,
                  isWarmup: false,
                  isFailure: false,
                  setKind: 'normal',
                  parentSetOrder: null,
                  completedAt: performedAt,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test('listWorkoutSessions delegates to persistence', async () => {
    mockedListTenantWorkoutSessionRecords.mockResolvedValueOnce([
      {
        id: 'workout-1',
        workoutName: 'Push Day',
        performedAt: '2026-03-22T12:00:00.000Z',
        durationMinutes: 55,
        notes: 'Heavy top sets',
        blockCount: 2,
        exerciseCount: 2,
      },
    ]);

    const { listWorkoutSessions } = await import('./workout.service');
    const result = await listWorkoutSessions('tenant_john', 'user-1');

    expect(mockedListTenantWorkoutSessionRecords).toHaveBeenCalledWith(
      'tenant_john',
      'user-1',
    );
    expect(result[0]?.blockCount).toBe(2);
  });
});
