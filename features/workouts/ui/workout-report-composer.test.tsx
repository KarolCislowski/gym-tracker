/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { WorkoutReportComposer } from './workout-report-composer';

vi.mock('./workout-report-form', () => ({
  WorkoutReportForm: () => <div>Workout form body</div>,
}));

describe('WorkoutReportComposer', () => {
  test('hides the workout form until the user opens it', () => {
    render(
      <WorkoutReportComposer
        exercises={[]}
        favoriteExerciseSlugs={[]}
        templates={[]}
        translations={enMessages}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Add workout report' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Workout form body')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add workout report' }));

    expect(screen.getByText('Workout form body')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hide workout form' }),
    ).toBeInTheDocument();
  });

  test('opens the workout form when a quick-start template is selected', () => {
    render(
      <WorkoutReportComposer
        exercises={[]}
        favoriteExerciseSlugs={[]}
        templates={[
          {
            id: 'template-1',
            name: 'Push A',
            notes: null,
            blockCount: 1,
            exerciseCount: 1,
            blocks: [],
          },
        ]}
        translations={enMessages}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Push A' }));

    expect(screen.getByText('Workout form body')).toBeInTheDocument();
    expect(screen.getByText('Quick start')).toBeInTheDocument();
  });
});
