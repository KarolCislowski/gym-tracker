'use client';

import { useMemo, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  EquipmentType,
  Exercise,
  ExerciseDifficulty,
  ExerciseType,
  MovementPattern,
} from '../domain/exercise.types';

export interface ExerciseAtlasRow {
  difficulty: string;
  equipment: string;
  equipmentList: EquipmentType[];
  id: string;
  movementPattern: string;
  name: string;
  primaryMuscleIds: string[];
  primaryMuscles: string;
  type: string;
  variants: number;
}

interface ExerciseAtlasFilterOptions {
  difficulties: ExerciseDifficulty[];
  equipment: EquipmentType[];
  patterns: MovementPattern[];
  primaryMuscles: string[];
  types: ExerciseType[];
}

interface ExerciseAtlasFiltersState {
  search: string;
  selectedDifficulties: ExerciseDifficulty[];
  selectedEquipment: EquipmentType[];
  selectedPatterns: MovementPattern[];
  selectedPrimaryMuscles: string[];
  selectedTypes: ExerciseType[];
}

/**
 * Manages atlas rows, filter state, and client-side filtering for the exercise grid.
 * @param exercises - Shared exercise definitions loaded from the server.
 * @returns Derived rows, filter options, state, and update handlers for the atlas UI.
 */
export function useExerciseAtlasGrid(exercises: Exercise[]) {
  const [search, setSearch] = useState('');
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

  const rows = useMemo<ExerciseAtlasRow[]>(
    () =>
      exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        type: exercise.type,
        movementPattern: exercise.movementPattern,
        difficulty: exercise.difficulty,
        primaryMuscleIds: exercise.muscles
          .filter((muscle) => muscle.role === 'primary')
          .map((muscle) => muscle.muscleGroupId),
        primaryMuscles: exercise.muscles
          .filter((muscle) => muscle.role === 'primary')
          .map((muscle) => formatAtlasToken(muscle.muscleGroupId))
          .join(', '),
        variants: exercise.variants.length,
        equipmentList: Array.from(
          new Set(exercise.variants.flatMap((variant) => variant.equipment)),
        ),
        equipment: Array.from(
          new Set(exercise.variants.flatMap((variant) => variant.equipment)),
        )
          .map((equipment) => formatAtlasToken(equipment))
          .join(', '),
      })),
    [exercises],
  );

  const filterOptions = useMemo<ExerciseAtlasFilterOptions>(
    () => ({
      types: Array.from(new Set(rows.map((row) => row.type as ExerciseType))).sort(),
      patterns: Array.from(
        new Set(rows.map((row) => row.movementPattern as MovementPattern)),
      ).sort(),
      difficulties: Array.from(
        new Set(rows.map((row) => row.difficulty as ExerciseDifficulty)),
      ).sort(),
      primaryMuscles: Array.from(
        new Set(rows.flatMap((row) => row.primaryMuscleIds)),
      ).sort(),
      equipment: Array.from(
        new Set(rows.flatMap((row) => row.equipmentList)),
      ).sort(),
    }),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch = normalizedSearch
        ? [
            row.name,
            row.type,
            row.movementPattern,
            row.difficulty,
            row.primaryMuscles,
            row.equipment,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(row.type as ExerciseType);
      const matchesPattern =
        selectedPatterns.length === 0 ||
        selectedPatterns.includes(row.movementPattern as MovementPattern);
      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(row.difficulty as ExerciseDifficulty);
      const matchesPrimaryMuscle =
        selectedPrimaryMuscles.length === 0 ||
        selectedPrimaryMuscles.some((muscle) =>
          row.primaryMuscleIds.includes(muscle),
        );
      const matchesEquipment =
        selectedEquipment.length === 0 ||
        selectedEquipment.some((equipment) => row.equipmentList.includes(equipment));

      return (
        matchesSearch &&
        matchesType &&
        matchesPattern &&
        matchesDifficulty &&
        matchesPrimaryMuscle &&
        matchesEquipment
      );
    });
  }, [
    rows,
    search,
    selectedDifficulties,
    selectedEquipment,
    selectedPatterns,
    selectedPrimaryMuscles,
    selectedTypes,
  ]);

  return {
    filteredRows,
    filterOptions,
    filters: {
      search,
      selectedTypes,
      selectedPatterns,
      selectedDifficulties,
      selectedPrimaryMuscles,
      selectedEquipment,
    } satisfies ExerciseAtlasFiltersState,
    setSearch,
    setSelectedTypes,
    setSelectedPatterns,
    setSelectedDifficulties,
    setSelectedPrimaryMuscles,
    setSelectedEquipment,
    resetFilters,
  };

  function resetFilters(): void {
    setSearch('');
    setSelectedTypes([]);
    setSelectedPatterns([]);
    setSelectedDifficulties([]);
    setSelectedPrimaryMuscles([]);
    setSelectedEquipment([]);
  }
}

/**
 * Builds localized data-grid columns for the exercise atlas.
 * @param translations - Localized atlas labels used by the grid headers.
 * @returns A memoized column definition array for the atlas grid.
 */
export function useExerciseAtlasGridColumns(
  translations: TranslationDictionary['exercises'],
): GridColDef<ExerciseAtlasRow>[] {
  return useMemo(
    () => [
      {
        field: 'name',
        headerName: translations.columnExercise,
        flex: 1.4,
        minWidth: 220,
      },
      {
        field: 'type',
        headerName: translations.columnType,
        flex: 0.8,
        minWidth: 120,
      },
      {
        field: 'movementPattern',
        headerName: translations.columnPattern,
        flex: 1,
        minWidth: 160,
      },
      {
        field: 'difficulty',
        headerName: translations.columnDifficulty,
        flex: 0.8,
        minWidth: 130,
      },
      {
        field: 'primaryMuscles',
        headerName: translations.columnPrimaryMuscles,
        flex: 1.2,
        minWidth: 200,
      },
      {
        field: 'variants',
        headerName: translations.columnVariants,
        type: 'number',
        flex: 0.6,
        minWidth: 110,
      },
      {
        field: 'equipment',
        headerName: translations.columnEquipment,
        flex: 1.2,
        minWidth: 220,
      },
    ] satisfies GridColDef<ExerciseAtlasRow>[],
    [translations],
  );
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

/**
 * Formats atlas tokens such as slugs or enum values into human-readable labels.
 * @param value - Raw atlas token value.
 * @returns A title-cased label for presentation in the grid UI.
 */
export function formatAtlasToken(value: string): string {
  return value
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
