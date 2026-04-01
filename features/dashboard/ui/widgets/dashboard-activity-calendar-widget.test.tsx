/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { DashboardActivityCalendarWidget } from './dashboard-activity-calendar-widget';

describe('DashboardActivityCalendarWidget', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-22T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders selected-day links for daily reports and workouts', () => {
    render(
      <DashboardActivityCalendarWidget
        dailyReports={[
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
        ]}
        language='en'
        translations={enMessages.dashboard}
        workoutSessions={[
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
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '21' }));

    expect(
      screen.getByRole('link', { name: 'Open daily report' }),
    ).toHaveAttribute('href', '/daily-reports/daily-report-1');
    expect(
      screen.getByRole('link', { name: 'Open workout: Push day' }),
    ).toHaveAttribute('href', '/workouts/workout-1');
  });

  test('shows an empty-day message when the selected day has no reports', () => {
    render(
      <DashboardActivityCalendarWidget
        dailyReports={[
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
        ]}
        language='en'
        translations={enMessages.dashboard}
        workoutSessions={[]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '22' }));

    expect(
      screen.getByText('No reports logged for this day yet.'),
    ).toBeInTheDocument();
  });
});
