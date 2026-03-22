/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { DashboardHome } from './dashboard-home';

describe('DashboardHome', () => {
  /**
   * Verifies that the dashboard overview renders tenant profile and settings content.
   */
  test('renders the dashboard overview content', () => {
    render(
      <DashboardHome
        tenantDbName='tenant_john_123'
        translations={enMessages}
        userSnapshot={{
          profile: {
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            age: 31,
            heightCm: 180,
            gender: 'male',
            activityLevel: 'moderately_active',
          },
          settings: {
            language: 'sv',
            isDarkMode: true,
            unitSystem: 'imperial_uk',
          },
          healthyHabits: {
            averageSleepHoursPerDay: 7.5,
            stepsPerDay: 9000,
            waterLitersPerDay: 2,
            proteinGramsPerDay: 150,
            strengthWorkoutsPerWeek: 3,
            cardioMinutesPerWeek: 120,
            regularSleepSchedule: true,
          },
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Welcome back' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/tenant database: tenant_john_123/i)).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.getByText('5 ft 11 in')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Moderately active')).toBeInTheDocument();
    expect(screen.getByText('sv')).toBeInTheDocument();
    expect(screen.getByText('Imperial (UK)')).toBeInTheDocument();
    expect(screen.getByText('9000')).toBeInTheDocument();
    expect(screen.getByText('7.5 h')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('70.4 fl oz')).toBeInTheDocument();
    expect(screen.getByText('150 g')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Go to profile' }),
    ).toHaveLength(2);
  });
});
