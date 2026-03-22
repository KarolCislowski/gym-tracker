/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { ExerciseAtlasPage } from './exercise-atlas-page';

describe('ExerciseAtlasPage', () => {
  /**
   * Verifies that the atlas page renders heading content and exercise rows.
   */
  test('renders the exercise atlas data grid', async () => {
    render(
      <ExerciseAtlasPage
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
                trackableMetrics: ['weight', 'reps'],
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
      screen.getByRole('heading', { name: 'Exercise atlas' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('pectorals')).toBeInTheDocument();
  });
});
