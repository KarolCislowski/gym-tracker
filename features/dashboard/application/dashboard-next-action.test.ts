import { describe, expect, test, vi } from 'vitest';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';

import { resolveDashboardNextAction } from './dashboard-next-action';

describe('resolveDashboardNextAction', () => {
  test('prioritizes completing the profile when profile details are missing', () => {
    const result = resolveDashboardNextAction({
      dailyReports: [],
      userSnapshot: {
        profile: {
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          birthDate: null,
          age: null,
          favoriteExerciseSlugs: [],
          location: null,
          heightCm: null,
          gender: null,
          activityLevel: null,
        },
        settings: {
          language: 'en',
          isDarkMode: false,
          unitSystem: 'metric',
          trackMenstrualCycle: false,
          trackLibido: false,
        },
        healthyHabits: null,
        favoriteExerciseSlugs: [],
      },
      workoutSessions: [],
    });

    expect(result).toEqual({ kind: 'complete_profile', href: '/profile' });
  });

  test('suggests setting goals when profile is ready but goals are missing', () => {
    const result = resolveDashboardNextAction({
      dailyReports: [],
      userSnapshot: createReadySnapshot({
        healthyHabits: null,
      }),
      workoutSessions: [],
    });

    expect(result).toEqual({ kind: 'set_goals', href: '/profile' });
  });

  test('suggests the first daily report before any reports exist', () => {
    const result = resolveDashboardNextAction({
      dailyReports: [],
      userSnapshot: createReadySnapshot(),
      workoutSessions: [],
    });

    expect(result).toEqual({ kind: 'first_daily_report', href: '/daily-reports' });
  });

  test('suggests the first workout when daily reports exist but workouts do not', () => {
    const result = resolveDashboardNextAction({
      dailyReports: [
        {
          id: 'daily-1',
          reportDate: '2026-03-27T00:00:00.000Z',
          wellbeing: { mood: 4, energy: 4, stress: 2, soreness: 2, libido: null, motivation: 4, recovery: 4 },
          body: { bodyWeightKg: 80, restingHeartRate: 55 },
          completion: { sleepGoalMet: true, stepsGoalMet: true, waterGoalMet: true, proteinGoalMet: true, cardioGoalMet: false },
          actuals: { sleepHours: 8, sleepScheduleKept: true, steps: 9000, waterLiters: 2, proteinGrams: 160, strengthWorkoutDone: false, cardioMinutes: 20 },
        },
      ],
      userSnapshot: createReadySnapshot(),
      workoutSessions: [],
    });

    expect(result).toEqual({ kind: 'first_workout', href: '/workouts' });
  });

  test('suggests today’s daily report when there is no entry for today', () => {
    vi.setSystemTime(new Date('2026-03-28T12:00:00.000Z'));

    const result = resolveDashboardNextAction({
      dailyReports: [
        {
          id: 'daily-1',
          reportDate: '2026-03-27T00:00:00.000Z',
          wellbeing: { mood: 4, energy: 4, stress: 2, soreness: 2, libido: null, motivation: 4, recovery: 4 },
          body: { bodyWeightKg: 80, restingHeartRate: 55 },
          completion: { sleepGoalMet: true, stepsGoalMet: true, waterGoalMet: true, proteinGoalMet: true, cardioGoalMet: false },
          actuals: { sleepHours: 8, sleepScheduleKept: true, steps: 9000, waterLiters: 2, proteinGrams: 160, strengthWorkoutDone: false, cardioMinutes: 20 },
        },
      ],
      userSnapshot: createReadySnapshot(),
      workoutSessions: [
        {
          id: 'workout-1',
          workoutName: 'Upper',
          performedAt: '2026-03-27T10:00:00.000Z',
          durationMinutes: 60,
          notes: null,
          blockCount: 2,
          exerciseCount: 5,
          setCount: 16,
        },
      ],
    });

    expect(result).toEqual({ kind: 'today_daily_report', href: '/daily-reports' });
  });

  test('suggests the next workout when today is logged but no recent workout exists', () => {
    vi.setSystemTime(new Date('2026-03-28T12:00:00.000Z'));

    const result = resolveDashboardNextAction({
      dailyReports: [
        {
          id: 'daily-1',
          reportDate: '2026-03-28T00:00:00.000Z',
          wellbeing: { mood: 4, energy: 4, stress: 2, soreness: 2, libido: null, motivation: 4, recovery: 4 },
          body: { bodyWeightKg: 80, restingHeartRate: 55 },
          completion: { sleepGoalMet: true, stepsGoalMet: true, waterGoalMet: true, proteinGoalMet: true, cardioGoalMet: false },
          actuals: { sleepHours: 8, sleepScheduleKept: true, steps: 9000, waterLiters: 2, proteinGrams: 160, strengthWorkoutDone: false, cardioMinutes: 20 },
        },
      ],
      userSnapshot: createReadySnapshot(),
      workoutSessions: [
        {
          id: 'workout-1',
          workoutName: 'Upper',
          performedAt: '2026-03-18T10:00:00.000Z',
          durationMinutes: 60,
          notes: null,
          blockCount: 2,
          exerciseCount: 5,
          setCount: 16,
        },
      ],
    });

    expect(result).toEqual({ kind: 'this_week_workout', href: '/workouts' });
  });

  test('falls back to reviewing progress when core habits and reporting are in motion', () => {
    vi.setSystemTime(new Date('2026-03-28T12:00:00.000Z'));

    const result = resolveDashboardNextAction({
      dailyReports: [
        {
          id: 'daily-1',
          reportDate: '2026-03-28T00:00:00.000Z',
          wellbeing: { mood: 4, energy: 4, stress: 2, soreness: 2, libido: null, motivation: 4, recovery: 4 },
          body: { bodyWeightKg: 80, restingHeartRate: 55 },
          completion: { sleepGoalMet: true, stepsGoalMet: true, waterGoalMet: true, proteinGoalMet: true, cardioGoalMet: false },
          actuals: { sleepHours: 8, sleepScheduleKept: true, steps: 9000, waterLiters: 2, proteinGrams: 160, strengthWorkoutDone: false, cardioMinutes: 20 },
        },
      ],
      userSnapshot: createReadySnapshot(),
      workoutSessions: [
        {
          id: 'workout-1',
          workoutName: 'Upper',
          performedAt: '2026-03-27T10:00:00.000Z',
          durationMinutes: 60,
          notes: null,
          blockCount: 2,
          exerciseCount: 5,
          setCount: 16,
        },
      ],
    });

    expect(result).toEqual({ kind: 'review_progress', href: '/#dashboard-analytics' });
  });
});

function createReadySnapshot(
  overrides: Partial<AuthenticatedUserSnapshot> = {},
): AuthenticatedUserSnapshot {
  return {
    profile: {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01T00:00:00.000Z',
      age: 36,
      favoriteExerciseSlugs: [],
      location: null,
      heightCm: 180,
      gender: 'male',
      activityLevel: 'moderately_active',
    },
    settings: {
      language: 'en',
      isDarkMode: false,
      unitSystem: 'metric',
      trackMenstrualCycle: false,
      trackLibido: false,
    },
    healthyHabits: {
      averageSleepHoursPerDay: 8,
      stepsPerDay: 9000,
      waterLitersPerDay: 2.5,
      proteinGramsPerDay: 160,
      strengthWorkoutsPerWeek: 4,
      cardioMinutesPerWeek: 90,
      regularSleepSchedule: true,
    },
    favoriteExerciseSlugs: [],
    ...overrides,
  };
}
