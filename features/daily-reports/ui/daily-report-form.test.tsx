/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { DailyReportForm } from './daily-report-form';

vi.mock('../infrastructure/daily-report.actions', () => ({
  createDailyReportAction: vi.fn(),
}));

describe('DailyReportForm', () => {
  /**
   * Verifies that the daily report form renders goals snapshot and wellbeing fields for mobile logging.
   */
  test('renders the daily check-in form', () => {
    render(
      <DailyReportForm
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
          healthyHabits: {
            averageSleepHoursPerDay: 8,
            stepsPerDay: 9000,
            waterLitersPerDay: 2.5,
            proteinGramsPerDay: 150,
            strengthWorkoutsPerWeek: 3,
            cardioMinutesPerWeek: 120,
            regularSleepSchedule: true,
          },
          favoriteExerciseSlugs: [],
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Daily check-in' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Current goals' }),
    ).toBeInTheDocument();
    expect(screen.getByText('8 h')).toBeInTheDocument();
    expect(
      screen.getByRole('switch', { name: 'Kept regular sleep schedule' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Soreness')).toBeInTheDocument();
    expect(screen.getByLabelText('Libido')).toBeInTheDocument();
    expect(screen.getByLabelText('Menstruation phase')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save daily report' }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that intimate hormonal-health fields stay hidden when tracking is disabled in settings.
   */
  test('hides menstrual-cycle and libido fields when private tracking is disabled', () => {
    render(
      <DailyReportForm
        translations={enMessages}
        userSnapshot={{
          profile: null,
          settings: {
            language: 'en',
            isDarkMode: false,
            unitSystem: 'metric',
            trackMenstrualCycle: false,
            trackLibido: false,
          },
          healthyHabits: null,
          favoriteExerciseSlugs: [],
        }}
      />,
    );

    expect(screen.queryByLabelText('Libido')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Menstruation phase')).not.toBeInTheDocument();
  });

  /**
   * Verifies that hydration uses the active measurement system instead of always defaulting to liters.
   */
  test('uses fluid ounces for hydration when the active unit system is imperial', () => {
    render(
      <DailyReportForm
        initialReport={{
          id: 'daily-1',
          reportDate: '2026-03-22T00:00:00.000Z',
          goalsSnapshot: {
            averageSleepHoursPerDay: 8,
            regularSleepSchedule: true,
            stepsPerDay: 9000,
            waterLitersPerDay: 2,
            proteinGramsPerDay: 150,
            strengthWorkoutsPerWeek: 3,
            cardioMinutesPerWeek: 120,
          },
          actuals: {
            sleepHours: 7.5,
            sleepScheduleKept: true,
            steps: 9500,
            waterLiters: 2,
            proteinGrams: 145,
            strengthWorkoutDone: true,
            cardioMinutes: 20,
          },
          wellbeing: {
            mood: 4,
            energy: 4,
            stress: 2,
            soreness: 3,
            libido: null,
            motivation: 4,
            recovery: 4,
          },
          body: {
            bodyWeightKg: null,
            restingHeartRate: null,
          },
          dayContext: {
            weatherSnapshot: null,
            menstruationPhase: null,
            illness: false,
            notes: null,
          },
          completion: {
            sleepGoalMet: true,
            stepsGoalMet: true,
            waterGoalMet: true,
            proteinGoalMet: false,
            cardioGoalMet: false,
          },
        }}
        translations={enMessages}
        userSnapshot={{
          profile: null,
          settings: {
            language: 'en',
            isDarkMode: false,
            unitSystem: 'imperial_us',
            trackMenstrualCycle: false,
            trackLibido: false,
          },
          healthyHabits: {
            averageSleepHoursPerDay: 8,
            stepsPerDay: 9000,
            waterLitersPerDay: 2,
            proteinGramsPerDay: 150,
            strengthWorkoutsPerWeek: 3,
            cardioMinutesPerWeek: 120,
            regularSleepSchedule: true,
          },
          favoriteExerciseSlugs: [],
        }}
      />,
    );

    expect(screen.getByLabelText('Water (fl oz)')).toBeInTheDocument();
    expect(screen.getByText(/67\.6 fl oz/i)).toBeInTheDocument();
  });
});
