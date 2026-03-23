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
          settings: null,
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
    expect(
      screen.getByRole('button', { name: 'Save daily report' }),
    ).toBeInTheDocument();
  });
});
