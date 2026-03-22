/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { ExerciseDetailsPage } from './exercise-details-page';

vi.mock('./exercise-favorite-button', () => ({
  ExerciseFavoriteButton: ({
    exerciseName,
    isFavorite,
  }: {
    exerciseName: string;
    isFavorite: boolean;
  }) => (
    <div>{`${isFavorite ? 'Favorite' : 'Not favorite'}: ${exerciseName}`}</div>
  ),
}));

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
            {
              muscleGroupId: 'triceps',
              role: 'secondary',
              activationLevel: 0.72,
            },
            {
              muscleGroupId: 'anterior_deltoids',
              role: 'stabilizer',
              activationLevel: 0.38,
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
        favoriteExerciseSlugs={['bench-press']}
        translations={enMessages}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Bench Press' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Favorite: Bench Press')).toBeInTheDocument();
    expect(screen.getAllByText('Barbell Bench Press')).toHaveLength(2);
    expect(screen.getByText('Flat Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Key details')).toBeInTheDocument();
    expect(screen.getByText('Muscle engagement')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Heuristic model (estimate), based on biomechanics + EMG + training practice.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Secondary muscles')).toBeInTheDocument();
    expect(screen.getByText('Supported equipment')).toBeInTheDocument();
    expect(screen.getByText('Triceps')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Variant comparison' })).toBeInTheDocument();
  });
});
