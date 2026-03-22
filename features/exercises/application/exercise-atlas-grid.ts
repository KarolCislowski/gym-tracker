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

export interface ExerciseAtlasFilterOptions {
  difficulties: ExerciseDifficulty[];
  equipment: EquipmentType[];
  patterns: MovementPattern[];
  primaryMuscles: string[];
  types: ExerciseType[];
}

export interface ExerciseAtlasFiltersState {
  search: string;
  selectedDifficulties: ExerciseDifficulty[];
  selectedEquipment: EquipmentType[];
  selectedPatterns: MovementPattern[];
  selectedPrimaryMuscles: string[];
  selectedTypes: ExerciseType[];
}

/**
 * Maps raw exercise atlas definitions into grid-ready presentation rows.
 * @param exercises - Shared exercise definitions loaded from the Core atlas.
 * @returns An array of rows prepared for the exercise atlas grid.
 */
export function buildExerciseAtlasRows(
  exercises: Exercise[],
): ExerciseAtlasRow[] {
  return exercises.map((exercise) => ({
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
  }));
}

/**
 * Builds the available atlas filter options from the prepared grid rows.
 * @param rows - Grid-ready atlas rows.
 * @returns Unique filter options for each selectable atlas filter.
 */
export function buildExerciseAtlasFilterOptions(
  rows: ExerciseAtlasRow[],
): ExerciseAtlasFilterOptions {
  return {
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
  };
}

/**
 * Filters atlas rows using the current client-side search and multi-select state.
 * @param rows - Grid-ready atlas rows.
 * @param filters - Current atlas filter state.
 * @returns The subset of rows matching the current filters.
 */
export function filterExerciseAtlasRows(
  rows: ExerciseAtlasRow[],
  filters: ExerciseAtlasFiltersState,
): ExerciseAtlasRow[] {
  const normalizedSearch = filters.search.trim().toLowerCase();

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
      filters.selectedTypes.length === 0 ||
      filters.selectedTypes.includes(row.type as ExerciseType);
    const matchesPattern =
      filters.selectedPatterns.length === 0 ||
      filters.selectedPatterns.includes(row.movementPattern as MovementPattern);
    const matchesDifficulty =
      filters.selectedDifficulties.length === 0 ||
      filters.selectedDifficulties.includes(row.difficulty as ExerciseDifficulty);
    const matchesPrimaryMuscle =
      filters.selectedPrimaryMuscles.length === 0 ||
      filters.selectedPrimaryMuscles.some((muscle) =>
        row.primaryMuscleIds.includes(muscle),
      );
    const matchesEquipment =
      filters.selectedEquipment.length === 0 ||
      filters.selectedEquipment.some((equipment) =>
        row.equipmentList.includes(equipment),
      );

    return (
      matchesSearch &&
      matchesType &&
      matchesPattern &&
      matchesDifficulty &&
      matchesPrimaryMuscle &&
      matchesEquipment
    );
  });
}

/**
 * Builds localized data-grid columns for the exercise atlas table.
 * @param translations - Localized atlas labels used in the grid headers.
 * @returns Column definitions for the exercise atlas grid.
 */
export function buildExerciseAtlasGridColumns(
  translations: TranslationDictionary['exercises'],
): GridColDef<ExerciseAtlasRow>[] {
  return [
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
  ];
}

/**
 * Normalizes atlas slugs and enum tokens into human-readable labels.
 * @param value - Raw atlas token.
 * @returns A title-cased token suitable for UI presentation.
 */
export function formatAtlasToken(value: string): string {
  return value
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
