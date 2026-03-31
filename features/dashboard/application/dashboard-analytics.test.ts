import { describe, expect, test } from 'vitest';

import { buildDashboardAnalytics } from './dashboard-analytics';

describe('dashboard-analytics', () => {
  test('builds chart-friendly dashboard analytics series', () => {
    const analytics = buildDashboardAnalytics(
      [
        {
          id: 'daily-2',
          reportDate: '2026-03-22T00:00:00.000Z',
          wellbeing: {
            mood: 4,
            energy: 3,
            stress: 2,
            soreness: 3,
            libido: null,
            motivation: 4,
            recovery: 4,
          },
          body: {
            bodyWeightKg: 82,
            restingHeartRate: 55,
          },
          completion: {
            sleepGoalMet: true,
            stepsGoalMet: false,
            waterGoalMet: true,
            proteinGoalMet: true,
            cardioGoalMet: false,
          },
          actuals: {
            sleepHours: 7,
            sleepScheduleKept: true,
            steps: 8000,
            waterLiters: 2.2,
            proteinGrams: 160,
            strengthWorkoutDone: true,
            cardioMinutes: 15,
          },
        },
        {
          id: 'daily-1',
          reportDate: '2026-03-21T00:00:00.000Z',
          wellbeing: {
            mood: 5,
            energy: 4,
            stress: 2,
            soreness: 2,
            libido: 4,
            motivation: 5,
            recovery: 5,
          },
          body: {
            bodyWeightKg: 81.5,
            restingHeartRate: 54,
          },
          completion: {
            sleepGoalMet: true,
            stepsGoalMet: true,
            waterGoalMet: true,
            proteinGoalMet: true,
            cardioGoalMet: true,
          },
          actuals: {
            sleepHours: 8,
            sleepScheduleKept: true,
            steps: 10000,
            waterLiters: 2.5,
            proteinGrams: 170,
            strengthWorkoutDone: false,
            cardioMinutes: 30,
          },
        },
      ],
      [
        {
          id: 'workout-1',
          workoutName: 'Upper Body',
          performedAt: '2026-03-20T10:00:00.000Z',
          durationMinutes: 60,
          notes: null,
          blockCount: 2,
          exerciseCount: 5,
          setCount: 16,
        },
        {
          id: 'workout-2',
          workoutName: 'Lower Body',
          performedAt: '2026-03-22T10:00:00.000Z',
          durationMinutes: 70,
          notes: null,
          blockCount: 3,
          exerciseCount: 6,
          setCount: 20,
        },
      ],
      [
        {
          id: 'workout-1',
          performedAt: '2026-03-20T10:00:00.000Z',
          entries: [
            { exerciseSlug: 'bench-press', variantId: 'variant-1', setCount: 8 },
            { exerciseSlug: 'row', variantId: 'variant-2', setCount: 8 },
          ],
        },
        {
          id: 'workout-2',
          performedAt: '2026-03-22T10:00:00.000Z',
          entries: [
            { exerciseSlug: 'back-squat', variantId: 'variant-3', setCount: 10 },
            {
              exerciseSlug: 'romanian-deadlift',
              variantId: 'variant-4',
              setCount: 10,
            },
          ],
        },
      ],
      [
        {
          id: 'exercise-1',
          name: 'Bench Press',
          slug: 'bench-press',
          type: 'compound',
          movementPattern: 'push',
          difficulty: 'beginner',
          muscles: [
            {
              muscleGroupId: 'pectorals',
              role: 'primary',
              activationLevel: 0.95,
            },
          ],
          variants: [{ id: 'variant-1', name: 'Barbell Bench Press', slug: 'barbell-bench-press', equipment: ['barbell'], trackableMetrics: ['weight', 'reps'] }],
          isActive: true,
        },
        {
          id: 'exercise-2',
          name: 'Row',
          slug: 'row',
          type: 'compound',
          movementPattern: 'pull',
          difficulty: 'beginner',
          muscles: [
            {
              muscleGroupId: 'lats',
              role: 'primary',
              activationLevel: 0.9,
            },
          ],
          variants: [{ id: 'variant-2', name: 'Barbell Row', slug: 'barbell-row', equipment: ['barbell'], trackableMetrics: ['weight', 'reps'] }],
          isActive: true,
        },
        {
          id: 'exercise-3',
          name: 'Back Squat',
          slug: 'back-squat',
          type: 'compound',
          movementPattern: 'squat',
          difficulty: 'beginner',
          muscles: [
            {
              muscleGroupId: 'quadriceps',
              role: 'primary',
              activationLevel: 0.92,
            },
          ],
          variants: [{ id: 'variant-3', name: 'Barbell Back Squat', slug: 'barbell-back-squat', equipment: ['barbell'], trackableMetrics: ['weight', 'reps'] }],
          isActive: true,
        },
        {
          id: 'exercise-4',
          name: 'Romanian Deadlift',
          slug: 'romanian-deadlift',
          type: 'compound',
          movementPattern: 'hinge',
          difficulty: 'beginner',
          muscles: [
            {
              muscleGroupId: 'hamstrings',
              role: 'primary',
              activationLevel: 0.9,
            },
          ],
          variants: [{ id: 'variant-4', name: 'Barbell Romanian Deadlift', slug: 'barbell-rdl', equipment: ['barbell'], trackableMetrics: ['weight', 'reps'] }],
          isActive: true,
        },
      ],
      {
        profile: {
          email: 'user@test.com',
          firstName: 'John',
          lastName: 'Doe',
          birthDate: null,
          age: null,
          favoriteExerciseSlugs: [],
          location: null,
          heightCm: 180,
          gender: null,
          activityLevel: null,
        },
        settings: null,
        healthyHabits: null,
        favoriteExerciseSlugs: [],
      },
    );

    expect(analytics.goalCompliance).toHaveLength(2);
    expect(analytics.goalCompliance[0]?.label).toBe('03/21');
    expect(analytics.wellbeing[1]?.mood).toBe(4);
    expect(analytics.bodyMetrics[0]?.bodyWeightKg).toBe(81.5);
    expect(analytics.workoutVolume).toHaveLength(1);
    expect([...analytics.workoutVolumeMuscleGroups].sort()).toEqual([
      'hamstrings',
      'lats',
      'pectorals',
      'quadriceps',
    ]);
    expect(analytics.workoutVolume[0]?.quadriceps).toBe(10);
    expect(analytics.workoutVolume[0]?.pectorals).toBe(8);
    expect(analytics.summaryMetrics.bmi).toEqual({
      value: 25.3,
      category: 'overweight',
    });
    expect(analytics.summaryMetrics.proteinPerKgBodyWeight.value).toBe(2);
    expect(analytics.summaryMetrics.hydrationAdherenceTrend.currentRate).toBe(100);
    expect(analytics.summaryMetrics.sleepConsistency.currentRate).toBe(100);
    expect(analytics.summaryMetrics.macroAdherenceScore.currentRate).toBe(100);
  });
});
