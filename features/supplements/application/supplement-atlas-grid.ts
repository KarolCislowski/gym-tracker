import type { GridColDef } from '@mui/x-data-grid';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  Supplement,
  SupplementCategory,
  SupplementCompoundType,
  SupplementEvidenceLevel,
  SupplementForm,
  SupplementGoal,
} from '../domain/supplement.types';

export interface SupplementAtlasRow {
  category: string;
  compoundTypes: string;
  compoundTypesList: SupplementCompoundType[];
  evidenceLevel: string;
  forms: string;
  formsList: SupplementForm[];
  goals: string;
  goalsList: SupplementGoal[];
  id: string;
  name: string;
  slug: string;
  variants: number;
}

export interface SupplementAtlasFilterOptions {
  categories: SupplementCategory[];
  compoundTypes: SupplementCompoundType[];
  evidenceLevels: SupplementEvidenceLevel[];
  forms: SupplementForm[];
  goals: SupplementGoal[];
}

export interface SupplementAtlasFiltersState {
  search: string;
  selectedCategories: SupplementCategory[];
  selectedCompoundTypes: SupplementCompoundType[];
  selectedEvidenceLevels: SupplementEvidenceLevel[];
  selectedForms: SupplementForm[];
  selectedGoals: SupplementGoal[];
}

/**
 * Maps supplement definitions into grid-ready rows.
 */
export function buildSupplementAtlasRows(
  supplements: Supplement[],
): SupplementAtlasRow[] {
  return supplements.map((supplement) => {
    const uniqueForms = Array.from(
      new Set(supplement.variants.map((variant) => variant.form)),
    );
    const uniqueCompoundTypes = Array.from(
      new Set(supplement.variants.map((variant) => variant.compoundType)),
    );

    return {
      id: supplement.id,
      slug: supplement.slug,
      name: supplement.name,
      category: supplement.category,
      evidenceLevel: supplement.evidenceLevel,
      variants: supplement.variants.length,
      goalsList: supplement.goals ?? [],
      goals: (supplement.goals ?? []).map(formatSupplementToken).join(', '),
      formsList: uniqueForms,
      forms: uniqueForms.map(formatSupplementToken).join(', '),
      compoundTypesList: uniqueCompoundTypes,
      compoundTypes: uniqueCompoundTypes.map(formatSupplementToken).join(', '),
    };
  });
}

/**
 * Builds available filter options for the supplement grid.
 */
export function buildSupplementAtlasFilterOptions(
  rows: SupplementAtlasRow[],
): SupplementAtlasFilterOptions {
  return {
    categories: Array.from(
      new Set(rows.map((row) => row.category as SupplementCategory)),
    ).sort(),
    evidenceLevels: Array.from(
      new Set(rows.map((row) => row.evidenceLevel as SupplementEvidenceLevel)),
    ).sort(),
    goals: Array.from(new Set(rows.flatMap((row) => row.goalsList))).sort(),
    forms: Array.from(new Set(rows.flatMap((row) => row.formsList))).sort(),
    compoundTypes: Array.from(
      new Set(rows.flatMap((row) => row.compoundTypesList)),
    ).sort(),
  };
}

/**
 * Filters supplement atlas rows using the current client-side state.
 */
export function filterSupplementAtlasRows(
  rows: SupplementAtlasRow[],
  filters: SupplementAtlasFiltersState,
): SupplementAtlasRow[] {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesSearch = normalizedSearch
      ? [row.name, row.category, row.evidenceLevel, row.goals, row.forms, row.compoundTypes]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      : true;
    const matchesCategory =
      filters.selectedCategories.length === 0 ||
      filters.selectedCategories.includes(row.category as SupplementCategory);
    const matchesEvidence =
      filters.selectedEvidenceLevels.length === 0 ||
      filters.selectedEvidenceLevels.includes(
        row.evidenceLevel as SupplementEvidenceLevel,
      );
    const matchesGoal =
      filters.selectedGoals.length === 0 ||
      filters.selectedGoals.some((goal) => row.goalsList.includes(goal));
    const matchesForm =
      filters.selectedForms.length === 0 ||
      filters.selectedForms.some((form) => row.formsList.includes(form));
    const matchesCompoundType =
      filters.selectedCompoundTypes.length === 0 ||
      filters.selectedCompoundTypes.some((compoundType) =>
        row.compoundTypesList.includes(compoundType),
      );

    return (
      matchesSearch &&
      matchesCategory &&
      matchesEvidence &&
      matchesGoal &&
      matchesForm &&
      matchesCompoundType
    );
  });
}

/**
 * Builds localized data-grid columns for the supplement atlas table.
 */
export function buildSupplementAtlasGridColumns(
  translations: TranslationDictionary['supplements'],
): GridColDef<SupplementAtlasRow>[] {
  return [
    {
      field: 'name',
      headerName: translations.columnSubstance,
      flex: 1.2,
      minWidth: 220,
    },
    {
      field: 'category',
      headerName: translations.columnCategory,
      flex: 0.9,
      minWidth: 150,
    },
    {
      field: 'evidenceLevel',
      headerName: translations.columnEvidence,
      flex: 0.8,
      minWidth: 140,
    },
    {
      field: 'goals',
      headerName: translations.columnGoals,
      flex: 1.2,
      minWidth: 220,
    },
    {
      field: 'forms',
      headerName: translations.columnForms,
      flex: 1,
      minWidth: 190,
    },
    {
      field: 'compoundTypes',
      headerName: translations.columnVariants,
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'variants',
      headerName: translations.columnVariantCount,
      type: 'number',
      flex: 0.6,
      minWidth: 120,
    },
  ];
}

/**
 * Normalizes enum tokens into human-readable labels.
 */
export function formatSupplementToken(value: string): string {
  return value
    .split('_')
    .join(' ')
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
