/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { ExerciseDetailsPage } from './exercise-details-page';

describe('ExerciseDetailsPage', () => {
  /**
   * Verifies that exercise details and variant comparison content render.
   */
  test('renders exercise details and variants', () => {
    render(
      <ExerciseDetailsPage
        exercise={{
          id: 'exercise-1',
          name: 'Bench Press',
          slug: 'bench-press',
          aliases: ['Flat Bench Press'],
          type: 'compound',
          movementPattern: 'push',
          difficulty: 'beginner',
          description: 'Horizontal pressing pattern.',
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
              bodyPosition: 'lying_flat',
              limbMode: 'bilateral',
              trackableMetrics: ['weight', 'reps'],
              isDefault: true,
            },
          ],
          goals: ['strength'],
          tags: ['chest'],
          instructions: ['Set your upper back.'],
          tips: ['Keep forearms stacked.'],
          commonMistakes: ['Flaring elbows.'],
          isActive: true,
        }}
        translations={enMessages}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Bench Press' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Barbell Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Flat Bench Press')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Variant comparison' })).toBeInTheDocument();
  });
});
