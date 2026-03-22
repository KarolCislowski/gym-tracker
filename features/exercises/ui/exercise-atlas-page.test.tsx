/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
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
            id: 'exercise-2',
            name: 'Lat Pulldown',
            slug: 'lat-pulldown',
            type: 'compound',
            movementPattern: 'pull',
            difficulty: 'beginner',
            muscles: [
              {
                muscleGroupId: 'lats',
                role: 'primary',
                activationLevel: 0.91,
              },
            ],
            variants: [
              {
                id: 'variant-2',
                name: 'Cable Lat Pulldown',
                slug: 'cable-lat-pulldown',
                equipment: ['cable'],
                trackableMetrics: ['weight', 'reps'],
              },
            ],
            isActive: true,
          },
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
    expect(screen.getByText('Pectorals')).toBeInTheDocument();
  });

  /**
   * Verifies that client-side atlas filters narrow the visible exercise rows.
   */
  test('filters the exercise atlas by equipment', async () => {
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
          {
            id: 'exercise-2',
            name: 'Lat Pulldown',
            slug: 'lat-pulldown',
            type: 'compound',
            movementPattern: 'pull',
            difficulty: 'beginner',
            muscles: [
              {
                muscleGroupId: 'lats',
                role: 'primary',
                activationLevel: 0.91,
              },
            ],
            variants: [
              {
                id: 'variant-2',
                name: 'Cable Lat Pulldown',
                slug: 'cable-lat-pulldown',
                equipment: ['cable'],
                trackableMetrics: ['weight', 'reps'],
              },
            ],
            isActive: true,
          },
        ]}
        translations={enMessages}
      />,
    );

    expect(await screen.findByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Lat Pulldown')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText('Equipment'));
    fireEvent.click(await screen.findByRole('option', { name: 'Cable' }));

    expect(screen.queryByText('Bench Press')).not.toBeInTheDocument();
    expect(screen.getByText('Lat Pulldown')).toBeInTheDocument();
  });
});
