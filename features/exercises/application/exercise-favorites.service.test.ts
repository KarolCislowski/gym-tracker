import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../infrastructure/exercise-favorites.db', () => ({
  addFavoriteExerciseRecord: vi.fn(),
  removeFavoriteExerciseRecord: vi.fn(),
}));

import {
  addFavoriteExerciseRecord,
  removeFavoriteExerciseRecord,
} from '../infrastructure/exercise-favorites.db';
import {
  addFavoriteExercise,
  removeFavoriteExercise,
} from './exercise-favorites.service';

const mockedAddFavoriteExerciseRecord = vi.mocked(addFavoriteExerciseRecord);
const mockedRemoveFavoriteExerciseRecord = vi.mocked(removeFavoriteExerciseRecord);

describe('exercise-favorites.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('addFavoriteExercise persists a favorite exercise slug', async () => {
    await addFavoriteExercise({
      tenantDbName: 'tenant_demo_user',
      userId: 'user-1',
      exerciseSlug: 'bench-press',
    });

    expect(mockedAddFavoriteExerciseRecord).toHaveBeenCalledWith({
      tenantDbName: 'tenant_demo_user',
      userId: 'user-1',
      exerciseSlug: 'bench-press',
    });
  });

  test('removeFavoriteExercise removes a favorite exercise slug', async () => {
    await removeFavoriteExercise({
      tenantDbName: 'tenant_demo_user',
      userId: 'user-1',
      exerciseSlug: 'bench-press',
    });

    expect(mockedRemoveFavoriteExerciseRecord).toHaveBeenCalledWith({
      tenantDbName: 'tenant_demo_user',
      userId: 'user-1',
      exerciseSlug: 'bench-press',
    });
  });
});
