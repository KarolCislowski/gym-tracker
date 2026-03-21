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
            gender: 'male',
            activityLevel: 'moderately_active',
          },
          settings: {
            language: 'sv',
            isDarkMode: true,
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
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Moderately active')).toBeInTheDocument();
    expect(screen.getByText('sv')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to profile' })).toBeInTheDocument();
  });
});
