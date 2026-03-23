/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { DailyReportDetailsPage } from './daily-report-details-page';

vi.mock('./daily-report-editor', () => ({
  DailyReportEditor: () => <div>Edit daily report block</div>,
}));

describe('DailyReportDetailsPage', () => {
  test('renders the daily report details summary', () => {
    render(
      <DailyReportDetailsPage
        report={{
          id: 'daily-1',
          reportDate: '2026-03-22T00:00:00.000Z',
          goalsSnapshot: {
            averageSleepHoursPerDay: 8,
            regularSleepSchedule: true,
            stepsPerDay: 10000,
            waterLitersPerDay: 2.5,
            proteinGramsPerDay: 160,
            strengthWorkoutsPerWeek: 4,
            cardioMinutesPerWeek: 120,
          },
          actuals: {
            sleepHours: 7.5,
            sleepScheduleKept: true,
            steps: 11000,
            waterLiters: 2.8,
            proteinGrams: 170,
            strengthWorkoutDone: true,
            cardioMinutes: 30,
          },
          wellbeing: {
            mood: 4,
            energy: 4,
            stress: 2,
            soreness: 3,
            libido: 4,
            motivation: 5,
            recovery: 4,
          },
          body: {
            bodyWeightKg: 81.2,
            restingHeartRate: 54,
          },
          dayContext: {
            weatherSnapshot: null,
            menstruationPhase: 'follicular',
            illness: false,
            notes: 'Good energy throughout the day.',
          },
          completion: {
            sleepGoalMet: false,
            stepsGoalMet: true,
            waterGoalMet: true,
            proteinGoalMet: true,
            cardioGoalMet: false,
          },
        }}
        translations={enMessages}
        userSnapshot={{
          profile: null,
          settings: {
            language: 'en',
            isDarkMode: false,
            unitSystem: 'metric',
            trackMenstrualCycle: true,
            trackLibido: true,
          },
          healthyHabits: null,
          favoriteExerciseSlugs: [],
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Daily report details' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Daily summary')).toBeInTheDocument();
    expect(screen.getByText('Goals snapshot')).toBeInTheDocument();
    expect(screen.getByText('Edit daily report block')).toBeInTheDocument();
    expect(screen.getByText('Good energy throughout the day.')).toBeInTheDocument();
  });
});
