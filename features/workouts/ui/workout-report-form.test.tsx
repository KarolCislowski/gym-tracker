/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { WorkoutReportForm } from './workout-report-form';

vi.mock('../infrastructure/workout.actions', () => ({
  createWorkoutReportAction: vi.fn(),
}));

describe('WorkoutReportForm', () => {
  /**
   * Verifies that the workout builder renders mobile-friendly sections and allows adding blocks.
   */
  test('renders the workout builder and adds another block', () => {
    render(
      <WorkoutReportForm
        exercises={[
          {
            id: 'exercise-1',
            name: 'Bench Press',
            slug: 'bench-press',
            type: 'compound',
            movementPattern: 'push',
            difficulty: 'beginner',
            muscles: [
              {
                muscleGroupId: 'pectorals',
                role: 'primary',
                activationLevel: 0.95,
              },
            ],
            variants: [
              {
                id: 'variant-1',
                name: 'Barbell Bench Press',
                slug: 'barbell-bench-press',
                equipment: ['barbell', 'bench'],
                gripOptions: ['pronated'],
                trackableMetrics: ['weight', 'reps', 'rpe'],
                isDefault: true,
              },
            ],
            isActive: true,
          },
        ]}
        translations={enMessages}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Log workout' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'The report will automatically use your saved profile location when available.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add block' }));

    expect(screen.getByText('Block type 2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save workout report' }),
    ).toBeInTheDocument();
  });
});
