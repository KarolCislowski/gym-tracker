import { describe, expect, test } from 'vitest';

import type { EquipmentType } from '../domain/exercise.types';

import {
  buildExerciseAtlasFilterOptions,
  buildExerciseAtlasRows,
  filterExerciseAtlasRows,
  formatAtlasToken,
} from './exercise-atlas-grid';

describe('exercise-atlas-grid', () => {
  /**
   * Verifies that atlas exercises are mapped into grid rows with formatted labels.
   */
  test('buildExerciseAtlasRows maps muscles and equipment for presentation', () => {
    const rows = buildExerciseAtlasRows([
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
          },
        ],
        isActive: true,
      },
    ]);

    expect(rows[0]).toMatchObject({
      name: 'Bench Press',
      primaryMuscles: 'Pectorals',
      equipment: 'Barbell, Bench',
    });
  });

  /**
   * Verifies that row filtering supports multi-select conditions across categories.
   */
  test('filterExerciseAtlasRows combines search and multi-select filters', () => {
    const rows = buildExerciseAtlasRows([
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
            activationLevel: 0.92,
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
    ]);

    const filteredRows = filterExerciseAtlasRows(rows, {
      search: '',
      selectedTypes: ['compound'],
      selectedPatterns: ['pull'],
      selectedDifficulties: ['beginner'],
      selectedPrimaryMuscles: ['lats'],
      selectedEquipment: ['cable'],
    });

    expect(filteredRows).toHaveLength(1);
    expect(filteredRows[0]?.name).toBe('Lat Pulldown');
  });

  /**
   * Verifies that filter options are deduplicated from atlas rows.
   */
  test('buildExerciseAtlasFilterOptions returns unique sorted options', () => {
    const rows = [
      {
        id: '1',
        name: 'Bench Press',
        type: 'compound',
        movementPattern: 'push',
        difficulty: 'beginner',
        primaryMuscleIds: ['pectorals'],
        primaryMuscles: 'Pectorals',
        variants: 1,
        equipmentList: ['barbell'] satisfies EquipmentType[],
        equipment: 'Barbell',
      },
      {
        id: '2',
        name: 'Incline Bench Press',
        type: 'compound',
        movementPattern: 'push',
        difficulty: 'intermediate',
        primaryMuscleIds: ['pectorals'],
        primaryMuscles: 'Pectorals',
        variants: 2,
        equipmentList: ['barbell', 'bench'] satisfies EquipmentType[],
        equipment: 'Barbell, Bench',
      },
    ];

    const options = buildExerciseAtlasFilterOptions(rows);

    expect(options.types).toEqual(['compound']);
    expect(options.primaryMuscles).toEqual(['pectorals']);
    expect(options.equipment).toEqual(['barbell', 'bench']);
  });

  /**
   * Verifies that atlas tokens are normalized into readable labels.
   */
  test('formatAtlasToken formats enum-style values', () => {
    expect(formatAtlasToken('smith_machine')).toBe('Smith Machine');
    expect(formatAtlasToken('front-side-delts')).toBe('Front Side Delts');
  });
});
