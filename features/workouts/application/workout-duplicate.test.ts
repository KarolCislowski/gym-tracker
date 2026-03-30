import { describe, expect, test } from 'vitest';

import { buildWorkoutDuplicateDraft } from './workout-duplicate';

describe('workout-duplicate', () => {
  /**
   * Verifies that duplicated workout drafts preserve structure while clearing execution-specific fields.
   */
  test('buildWorkoutDuplicateDraft resets runtime values and keeps the workout layout', () => {
    const duplicateDraft = buildWorkoutDuplicateDraft(
      {
        id: 'report-1',
        workoutName: 'Push Day',
        startedAt: '2026-03-22T10:00:00.000Z',
        endedAt: '2026-03-22T11:00:00.000Z',
        durationMinutes: 60,
        performedAt: '2026-03-22T11:00:00.000Z',
        notes: 'Heavy bench focus',
        locationSnapshot: null,
        weatherSnapshot: {
          provider: 'open-meteo',
          temperatureC: 8,
          apparentTemperatureC: 6,
          humidityPercent: 70,
          windSpeedKph: 10,
          precipitationMm: 0,
          weatherCode: 'cloudy',
          capturedAt: new Date('2026-03-22T11:00:00.000Z'),
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
                trackableMetrics: ['weight', 'reps', 'rpe'],
                selectedEquipment: ['barbell'],
                selectedGrip: 'pronated',
                selectedStance: null,
                selectedAttachment: null,
                notes: 'Pause reps',
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
                    completedAt: new Date('2026-03-22T10:15:00.000Z'),
                  },
                ],
              },
            ],
          },
        ],
      },
      new Date('2026-03-30T08:30:00.000Z'),
    );

    expect(duplicateDraft).toEqual({
      workoutName: 'Push Day',
      startedAt: null,
      endedAt: null,
      durationMinutes: null,
      performedAt: '2026-03-30T08:30:00.000Z',
      notes: 'Heavy bench focus',
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
              exerciseId: 'exercise-1',
              exerciseSlug: 'bench-press',
              variantId: 'variant-1',
              trackableMetrics: ['weight', 'reps', 'rpe'],
              selectedEquipment: ['barbell'],
              selectedGrip: 'pronated',
              selectedStance: null,
              selectedAttachment: null,
              notes: 'Pause reps',
              restAfterEntrySec: 180,
              sets: [
                {
                  order: 1,
                  reps: null,
                  weight: null,
                  durationSec: null,
                  distanceMeters: null,
                  calories: null,
                  rpe: null,
                  rir: null,
                  isWarmup: false,
                  isFailure: false,
                  setKind: 'top',
                  parentSetOrder: null,
                  completedAt: null,
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
