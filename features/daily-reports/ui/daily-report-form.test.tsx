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
      screen.getByRole('heading', { name: 'Current goals snapshot' }),
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
});
