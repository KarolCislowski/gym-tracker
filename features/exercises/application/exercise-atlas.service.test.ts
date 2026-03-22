import { describe, expect, test, vi } from 'vitest';

import { listExerciseAtlas } from './exercise-atlas.service';

vi.mock('../infrastructure/exercise-atlas.db', () => ({
  findExercises: vi.fn(),
}));

import { findExercises } from '../infrastructure/exercise-atlas.db';

const mockedFindExercises = vi.mocked(findExercises);

describe('exercise-atlas.service', () => {
  /**
   * Verifies that active exercises can be filtered by equipment and search terms.
   */
  test('listExerciseAtlas filters active exercises by equipment and search', async () => {
    mockedFindExercises.mockResolvedValueOnce([
      {
        id: 'exercise-1',
        name: 'Bench Press',
        slug: 'bench-press',
        aliases: ['BB Bench'],
        type: 'compound',
        movementPattern: 'push',
        difficulty: 'beginner',
        muscles: [
          {
            muscleGroupId: 'chest',
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
            trackableMetrics: ['weight', 'reps', 'rpe'],
            isDefault: true,
          },
        ],
        goals: ['strength', 'hypertrophy'],
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
            activationLevel: 0.9,
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
        id: 'exercise-3',
        name: 'Archived Fly',
        slug: 'archived-fly',
        type: 'isolation',
        movementPattern: 'push',
        difficulty: 'beginner',
        muscles: [],
        variants: [],
        isActive: false,
      },
    ]);

    const result = await listExerciseAtlas({
      equipment: 'barbell',
      search: 'bench',
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe('bench-press');
  });
});
