'use client';

import { useEffect, useState } from 'react';

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';

import {
  buildSupplementAtlasGridColumns,
} from '../application/supplement-atlas-grid';
import type {
  Supplement,
  SupplementCategory,
  SupplementCompoundType,
  SupplementEvidenceLevel,
  SupplementForm,
  SupplementGoal,
} from '../domain/supplement.types';
import {
  formatSupplementToken,
  normalizeSupplementMultiSelectValue,
  useSupplementAtlasGrid,
} from './use-supplement-atlas-grid';

interface SupplementAtlasGridProps {
  supplements: Supplement[];
  translations: TranslationDictionary['supplements'];
}

/**
 * Client-side data grid for browsing the shared supplement atlas.
 * @param props - Component props for the supplement atlas grid.
 * @param props.supplements - Supplements already loaded on the server.
 * @param props.translations - Localized labels used by the grid and filter controls.
 * @returns A React element rendering filter controls and supplement rows.
 * @remarks Filtering is handled fully on the client against the server-loaded atlas snapshot.
 */
export function SupplementAtlasGrid({
  supplements,
  translations,
}: SupplementAtlasGridProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const isPortrait = useMediaQuery('(orientation: portrait)', { noSsr: true });
  const [hasMounted, setHasMounted] = useState(false);
  const {
    filteredRows,
    filterOptions,
    filters,
    resetFilters,
    setSearch,
    setSelectedCategories,
    setSelectedCompoundTypes,
    setSelectedEvidenceLevels,
    setSelectedForms,
    setSelectedGoals,
  } = useSupplementAtlasGrid(supplements);
  const actionColumn = {
    field: 'actions',
    headerName: translations.columnActions,
    sortable: false,
    filterable: false,
    pinnable: true,
    width: 88,
    align: 'center' as const,
    headerAlign: 'center' as const,
    renderCell: ({ row }: { row: { slug: string; name: string } }) => (
      <Tooltip title={translations.viewDetails}>
        <IconButton
          aria-label={`${translations.viewDetails}: ${row.name}`}
          href={`/supplements/${row.slug}`}
          size='small'
        >
          <VisibilityRoundedIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    ),
  };
  const columns = buildSupplementAtlasGridColumns(translations)
    .map((column) =>
      column.field === 'name' ? { ...column, pinnable: true } : column,
    )
    .flatMap((column) => (column.field === 'name' ? [column, actionColumn] : [column]));

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <AtlasGridPlaceholder />;
  }

  if (isMobile && isPortrait) {
    return (
      <AtlasMobileNotice
        description={translations.mobileAtlasDescription}
        title={translations.mobileAtlasTitle}
      />
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={1.5}
        useFlexGap
        flexWrap='wrap'
      >
        <TextField
          aria-label={translations.searchPlaceholder}
          label={translations.searchPlaceholder}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: { xs: '100%', lg: 240 }, flex: 1 }}
          value={filters.search}
        />
        <TextField
          label={translations.filterCategoryLabel}
          onChange={(event) => {
            setSelectedCategories(
              normalizeSupplementMultiSelectValue(
                event.target.value,
              ) as SupplementCategory[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={formatSupplementToken(value)} size='small' />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 180 } }}
          value={filters.selectedCategories}
        >
          {filterOptions.categories.map((value) => (
            <MenuItem key={value} value={value}>
              {formatSupplementToken(value)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterEvidenceLabel}
          onChange={(event) => {
            setSelectedEvidenceLevels(
              normalizeSupplementMultiSelectValue(
                event.target.value,
              ) as SupplementEvidenceLevel[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={formatSupplementToken(value)} size='small' />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 180 } }}
          value={filters.selectedEvidenceLevels}
        >
          {filterOptions.evidenceLevels.map((value) => (
            <MenuItem key={value} value={value}>
              {formatSupplementToken(value)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterGoalLabel}
          onChange={(event) => {
            setSelectedGoals(
              normalizeSupplementMultiSelectValue(event.target.value) as SupplementGoal[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={formatSupplementToken(value)} size='small' />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 180 } }}
          value={filters.selectedGoals}
        >
          {filterOptions.goals.map((value) => (
            <MenuItem key={value} value={value}>
              {formatSupplementToken(value)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterFormLabel}
          onChange={(event) => {
            setSelectedForms(
              normalizeSupplementMultiSelectValue(event.target.value) as SupplementForm[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={formatSupplementToken(value)} size='small' />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 180 } }}
          value={filters.selectedForms}
        >
          {filterOptions.forms.map((value) => (
            <MenuItem key={value} value={value}>
              {formatSupplementToken(value)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterCompoundTypeLabel}
          onChange={(event) => {
            setSelectedCompoundTypes(
              normalizeSupplementMultiSelectValue(
                event.target.value,
              ) as SupplementCompoundType[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={formatSupplementToken(value)} size='small' />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 220 } }}
          value={filters.selectedCompoundTypes}
        >
          {filterOptions.compoundTypes.map((value) => (
            <MenuItem key={value} value={value}>
              {formatSupplementToken(value)}
            </MenuItem>
          ))}
        </TextField>
        <Button
          onClick={resetFilters}
          sx={{ alignSelf: { xs: 'stretch', lg: 'center' }, minHeight: 56 }}
          variant='outlined'
        >
          {translations.clearFilters}
        </Button>
      </Stack>

      <AppCard padding='sm' radius='lg' tone='standard'>
        <DataGrid
          autoHeight
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          rows={filteredRows}
          sx={{
            border: 0,
            '& .MuiDataGrid-cell': {
              alignItems: 'center',
            },
          }}
        />
      </AppCard>

      {!filteredRows.length ? (
        <Typography color='text.secondary'>{translations.emptyState}</Typography>
      ) : null}
    </Stack>
  );
}

function AtlasMobileNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AppCard padding='lg' radius='lg' tone='standard'>
      <Stack spacing={1}>
        <Typography variant='h6'>{title}</Typography>
        <Typography color='text.secondary'>{description}</Typography>
      </Stack>
    </AppCard>
  );
}

function AtlasGridPlaceholder() {
  return <AppCard minHeight={240} padding='sm' radius='lg' tone='standard' />;
}
