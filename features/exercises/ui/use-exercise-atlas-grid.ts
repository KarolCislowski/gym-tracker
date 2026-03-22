'use client';

import { useMemo, useState } from 'react';

import type {
  EquipmentType,
  Exercise,
  ExerciseDifficulty,
  ExerciseType,
  MovementPattern,
} from '../domain/exercise.types';
import {
  buildExerciseAtlasFilterOptions,
  buildExerciseAtlasGridColumns,
  buildExerciseAtlasRows,
  filterExerciseAtlasRows,
  type ExerciseAtlasFiltersState,
} from '../application/exercise-atlas-grid';
export { formatAtlasToken } from '../application/exercise-atlas-grid';

/**
 * Manages atlas rows, filter state, and client-side filtering for the exercise grid.
 * @param exercises - Shared exercise definitions loaded from the server.
 * @returns Derived rows, filter options, state, and update handlers for the atlas UI.
 */
export function useExerciseAtlasGrid(
  exercises: Exercise[],
  favoriteExerciseSlugs: string[],
) {
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<MovementPattern[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    ExerciseDifficulty[]
  >([]);
  const [selectedPrimaryMuscles, setSelectedPrimaryMuscles] = useState<string[]>(
    [],
  );
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>(
    [],
  );

  const rows = useMemo(() => buildExerciseAtlasRows(exercises), [exercises]);

  const filterOptions = useMemo(
    () => buildExerciseAtlasFilterOptions(rows),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return filterExerciseAtlasRows(
      rows,
      {
        search: normalizedSearch,
        showFavoritesOnly,
        selectedTypes,
        selectedPatterns,
        selectedDifficulties,
        selectedPrimaryMuscles,
        selectedEquipment,
      },
      favoriteExerciseSlugs,
    );
  }, [
    favoriteExerciseSlugs,
    rows,
    showFavoritesOnly,
    selectedDifficulties,
    selectedEquipment,
    selectedPatterns,
    selectedPrimaryMuscles,
    selectedTypes,
    search,
  ]);

  return {
    filteredRows,
    filterOptions,
    filters: {
      search,
      showFavoritesOnly,
      selectedTypes,
      selectedPatterns,
      selectedDifficulties,
      selectedPrimaryMuscles,
      selectedEquipment,
    } satisfies ExerciseAtlasFiltersState,
    setSearch,
    setShowFavoritesOnly,
    setSelectedTypes,
    setSelectedPatterns,
    setSelectedDifficulties,
    setSelectedPrimaryMuscles,
    setSelectedEquipment,
    resetFilters,
  };

  function resetFilters(): void {
    setSearch('');
    setShowFavoritesOnly(false);
    setSelectedTypes([]);
    setSelectedPatterns([]);
    setSelectedDifficulties([]);
    setSelectedPrimaryMuscles([]);
    setSelectedEquipment([]);
  }
}

/**
 * Normalizes multi-select values from MUI inputs into a string array.
 * @param value - Raw value emitted from the select input.
 * @returns A normalized string array for multi-select filter state.
 */
export function normalizeAtlasMultiSelectValue(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.split(',').filter(Boolean);
  }

  return Array.isArray(value) ? value.map(String) : [];
}
export function useExerciseAtlasGridColumns(
  translations: Parameters<typeof buildExerciseAtlasGridColumns>[0],
) {
  return useMemo(() => buildExerciseAtlasGridColumns(translations), [translations]);
}
