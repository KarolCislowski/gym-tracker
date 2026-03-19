/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { AppShell } from './app-shell';

describe('AppShell', () => {
  /**
   * Verifies that the shared shell renders the header, navigation, and nested page content.
   */
  test('renders authenticated shell content', () => {
    render(
      <AppShell
        displayName='John Doe'
        logoutAction={vi.fn(async () => {})}
        translations={enMessages}
      >
        <div>Dashboard body</div>
      </AppShell>,
    );

    expect(screen.getByText('Dashboard body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
  });

  /**
   * Verifies that the desktop navigation drawer can switch between expanded and collapsed states.
   */
  test('toggles the desktop side drawer state', () => {
    render(
      <AppShell
        displayName='John Doe'
        logoutAction={vi.fn(async () => {})}
        translations={enMessages}
      >
        <div>Dashboard body</div>
      </AppShell>,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Collapse navigation' }),
    );

    expect(
      screen.getByRole('button', { name: 'Expand navigation' }),
    ).toBeInTheDocument();
  });
});
