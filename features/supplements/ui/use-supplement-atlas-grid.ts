'use client';

import { useMemo, useState } from 'react';

import type {
  Supplement,
  SupplementCategory,
  SupplementCompoundType,
  SupplementEvidenceLevel,
  SupplementForm,
  SupplementGoal,
} from '../domain/supplement.types';
import {
  buildSupplementAtlasFilterOptions,
  buildSupplementAtlasRows,
  filterSupplementAtlasRows,
  type SupplementAtlasFiltersState,
} from '../application/supplement-atlas-grid';

export { formatSupplementToken } from '../application/supplement-atlas-grid';

/**
 * Manages rows, filter state, and filtering for the supplement atlas grid.
 * @param supplements - Shared supplement definitions loaded from the server.
 * @returns Derived rows, filter options, state, and update handlers for the supplement atlas UI.
 */
export function useSupplementAtlasGrid(supplements: Supplement[]) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<
    SupplementCategory[]
  >([]);
  const [selectedEvidenceLevels, setSelectedEvidenceLevels] = useState<
    SupplementEvidenceLevel[]
  >([]);
  const [selectedGoals, setSelectedGoals] = useState<SupplementGoal[]>([]);
  const [selectedForms, setSelectedForms] = useState<SupplementForm[]>([]);
  const [selectedCompoundTypes, setSelectedCompoundTypes] = useState<
    SupplementCompoundType[]
  >([]);

  const rows = useMemo(() => buildSupplementAtlasRows(supplements), [supplements]);
  const filterOptions = useMemo(
    () => buildSupplementAtlasFilterOptions(rows),
    [rows],
  );
  const filteredRows = useMemo(
    () =>
      filterSupplementAtlasRows(rows, {
        search,
        selectedCategories,
        selectedCompoundTypes,
        selectedEvidenceLevels,
        selectedForms,
        selectedGoals,
      }),
    [
      rows,
      search,
      selectedCategories,
      selectedCompoundTypes,
      selectedEvidenceLevels,
      selectedForms,
      selectedGoals,
    ],
  );

  return {
    filteredRows,
    filterOptions,
    filters: {
      search,
      selectedCategories,
      selectedCompoundTypes,
      selectedEvidenceLevels,
      selectedForms,
      selectedGoals,
    } satisfies SupplementAtlasFiltersState,
    setSearch,
    setSelectedCategories,
    setSelectedCompoundTypes,
    setSelectedEvidenceLevels,
    setSelectedForms,
    setSelectedGoals,
    resetFilters,
  };

  function resetFilters(): void {
    setSearch('');
    setSelectedCategories([]);
    setSelectedCompoundTypes([]);
    setSelectedEvidenceLevels([]);
    setSelectedForms([]);
    setSelectedGoals([]);
  }
}

/**
 * Normalizes multi-select values emitted by MUI select components.
 * @param value - Raw value emitted by a multi-select input.
 * @returns A normalized string array suitable for supplement filter state.
 */
export function normalizeSupplementMultiSelectValue(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.split(',').filter(Boolean);
  }

  return Array.isArray(value) ? value.map(String) : [];
}
