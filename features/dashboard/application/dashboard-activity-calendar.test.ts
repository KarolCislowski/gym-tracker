import { describe, expect, test } from 'vitest';

import {
  buildDashboardActivityCalendarMonth,
  resolveDashboardActivityCalendarSelection,
} from './dashboard-activity-calendar';

describe('buildDashboardActivityCalendarMonth', () => {
  test('merges daily reports and workouts into a month grid keyed by UTC day', () => {
    const result = buildDashboardActivityCalendarMonth({
      dailyReports: [
        {
          id: 'daily-report-1',
          reportDate: '2026-03-21T06:00:00.000Z',
          actuals: {
            sleepHours: 7.5,
            sleepScheduleKept: true,
            steps: 9000,
            waterLiters: 2,
            proteinGrams: 150,
            strengthWorkoutDone: true,
            cardioMinutes: 20,
          },
          body: {
            bodyWeightKg: 81.5,
            restingHeartRate: 55,
          },
          completion: {
            sleepGoalMet: true,
            stepsGoalMet: true,
            waterGoalMet: true,
            proteinGoalMet: true,
            cardioGoalMet: false,
          },
          wellbeing: {
            mood: 4,
            energy: 4,
            stress: 2,
            soreness: 2,
            libido: null,
            motivation: 4,
            recovery: 4,
          },
        },
      ],
      now: new Date('2026-03-22T12:00:00.000Z'),
      referenceDate: new Date('2026-03-22T12:00:00.000Z'),
      workoutSessions: [
        {
          id: 'workout-1',
          workoutName: 'Push day',
          performedAt: '2026-03-21T18:00:00.000Z',
          durationMinutes: 70,
          notes: null,
          blockCount: 2,
          exerciseCount: 5,
          setCount: 16,
        },
      ],
    });

    const march21 = result.days.find((day) => day.dateKey === '2026-03-21');
    const march22 = result.days.find((day) => day.dateKey === '2026-03-22');

    expect(result.days).toHaveLength(42);
    expect(result.monthStartKey).toBe('2026-03-01');
    expect(result.monthEndKey).toBe('2026-03-31');
    expect(march21).toMatchObject({
      dailyReportId: 'daily-report-1',
      dayOfMonth: 21,
      isCurrentMonth: true,
      isToday: false,
    });
    expect(march21?.workoutReports).toEqual([
      {
        id: 'workout-1',
        workoutName: 'Push day',
      },
    ]);
    expect(march22).toMatchObject({
      dailyReportId: null,
      isToday: true,
      workoutReports: [],
    });
  });
});

describe('resolveDashboardActivityCalendarSelection', () => {
  test('prefers today when it belongs to the visible month', () => {
    const month = buildDashboardActivityCalendarMonth({
      dailyReports: [],
      now: new Date('2026-03-22T12:00:00.000Z'),
      referenceDate: new Date('2026-03-22T12:00:00.000Z'),
      workoutSessions: [],
    });

    expect(resolveDashboardActivityCalendarSelection(month)).toBe('2026-03-22');
  });

  test('falls back to the first day with entries when today is outside the visible month', () => {
    const month = buildDashboardActivityCalendarMonth({
      dailyReports: [
        {
          id: 'daily-report-1',
          reportDate: '2026-03-07T00:00:00.000Z',
          actuals: {
            sleepHours: null,
            sleepScheduleKept: null,
            steps: null,
            waterLiters: null,
            proteinGrams: null,
            strengthWorkoutDone: null,
            cardioMinutes: null,
          },
          body: {
            bodyWeightKg: null,
            restingHeartRate: null,
          },
          completion: {
            sleepGoalMet: null,
            stepsGoalMet: null,
            waterGoalMet: null,
            proteinGoalMet: null,
            cardioGoalMet: null,
          },
          wellbeing: {
            mood: null,
            energy: null,
            stress: null,
            soreness: null,
            libido: null,
            motivation: null,
            recovery: null,
          },
        },
      ],
      now: new Date('2026-04-22T12:00:00.000Z'),
      referenceDate: new Date('2026-03-22T12:00:00.000Z'),
      workoutSessions: [],
    });

    expect(resolveDashboardActivityCalendarSelection(month)).toBe('2026-03-07');
  });
});
