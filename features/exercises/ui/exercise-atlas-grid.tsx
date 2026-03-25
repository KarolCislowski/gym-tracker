'use client';

import { useEffect, useState } from 'react';

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { DataGrid } from '@mui/x-data-grid';
import {
  Checkbox,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  EquipmentType,
  Exercise,
  ExerciseDifficulty,
  ExerciseType,
  MovementPattern,
} from '../domain/exercise.types';
import { buildExerciseAtlasGridColumns } from '../application/exercise-atlas-grid';
import {
  formatAtlasToken,
  normalizeAtlasMultiSelectValue,
  useExerciseAtlasGrid,
} from './use-exercise-atlas-grid';
import { ExerciseFavoriteButton } from './exercise-favorite-button';

interface ExerciseAtlasGridProps {
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  translations: TranslationDictionary['exercises'];
}

/**
 * Client-side data grid for browsing the shared exercise atlas.
 * @param props - Component props for the atlas grid.
 * @param props.exercises - Exercises already loaded on the server.
 * @param props.translations - Localized labels used by the grid.
 * @returns A React element rendering atlas search and rows.
 */
export function ExerciseAtlasGrid({
  exercises,
  favoriteExerciseSlugs,
  translations,
}: ExerciseAtlasGridProps) {
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
    setShowFavoritesOnly,
    setSelectedDifficulties,
    setSelectedEquipment,
    setSelectedPatterns,
    setSelectedPrimaryMuscles,
    setSelectedTypes,
  } = useExerciseAtlasGrid(exercises, favoriteExerciseSlugs);
  const actionColumn = {
    field: 'actions',
    headerName: translations.columnActions,
    sortable: false,
    filterable: false,
    pinnable: true,
    width: 132,
    align: 'center' as const,
    headerAlign: 'center' as const,
    renderCell: ({ row }: { row: { name: string } & { id: string } }) => {
      const exercise = exercises.find((candidate) => candidate.id === row.id);

      if (!exercise) {
        return null;
      }

      return (
        <Stack direction='row' spacing={0.5}>
          <ExerciseFavoriteButton
            exerciseName={exercise.name}
            exerciseSlug={exercise.slug}
            isFavorite={favoriteExerciseSlugs.includes(exercise.slug)}
            translations={translations}
          />
          <Tooltip title={translations.viewDetails}>
            <IconButton
              aria-label={`${translations.viewDetails}: ${exercise.name}`}
              href={`/exercises/${exercise.slug}`}
              size='small'
            >
              <VisibilityRoundedIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Stack>
      );
    },
  };
  const columns = [
    ...buildExerciseAtlasGridColumns(translations)
      .map((column) =>
        column.field === 'name' ? { ...column, pinnable: true } : column,
      )
      .flatMap((column) =>
        column.field === 'name' ? [column, actionColumn] : [column],
      ),
  ];
  const initialState = {
    pagination: {
      paginationModel: {
        pageSize: 10,
        page: 0,
      },
    },
    pinnedColumns: {
      left: ['name', 'actions'],
    },
  } as Parameters<typeof DataGrid>[0]['initialState'] & {
    pinnedColumns: {
      left: string[];
    };
  };

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
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.showFavoritesOnly}
              onChange={(event) => setShowFavoritesOnly(event.target.checked)}
            />
          }
          label={translations.filterFavoritesLabel}
          sx={{ minWidth: { xs: '100%', sm: 'auto' }, mx: 0.5 }}
        />
        <TextField
          label={translations.filterTypeLabel}
          onChange={(event) => {
            setSelectedTypes(
              normalizeAtlasMultiSelectValue(
                event.target.value,
              ) as ExerciseType[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((type) => (
                  <Chip key={type} label={formatAtlasToken(type)} size='small' />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 180 } }}
          value={filters.selectedTypes}
        >
          {filterOptions.types.map((type) => (
            <MenuItem key={type} value={type}>
              {formatAtlasToken(type)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterPatternLabel}
          onChange={(event) => {
            setSelectedPatterns(
              normalizeAtlasMultiSelectValue(
                event.target.value,
              ) as MovementPattern[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((pattern) => (
                  <Chip
                    key={pattern}
                    label={formatAtlasToken(pattern)}
                    size='small'
                  />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 180 } }}
          value={filters.selectedPatterns}
        >
          {filterOptions.patterns.map((pattern) => (
            <MenuItem key={pattern} value={pattern}>
              {formatAtlasToken(pattern)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterDifficultyLabel}
          onChange={(event) => {
            setSelectedDifficulties(
              normalizeAtlasMultiSelectValue(
                event.target.value,
              ) as ExerciseDifficulty[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((difficulty) => (
                  <Chip
                    key={difficulty}
                    label={formatAtlasToken(difficulty)}
                    size='small'
                  />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 180 } }}
          value={filters.selectedDifficulties}
        >
          {filterOptions.difficulties.map((difficulty) => (
            <MenuItem key={difficulty} value={difficulty}>
              {formatAtlasToken(difficulty)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterPrimaryMuscleLabel}
          onChange={(event) => {
            setSelectedPrimaryMuscles(
              normalizeAtlasMultiSelectValue(event.target.value),
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((muscle) => (
                  <Chip
                    key={muscle}
                    label={formatAtlasToken(muscle)}
                    size='small'
                  />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 220 } }}
          value={filters.selectedPrimaryMuscles}
        >
          {filterOptions.primaryMuscles.map((muscle) => (
            <MenuItem key={muscle} value={muscle}>
              {formatAtlasToken(muscle)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={translations.filterEquipmentLabel}
          onChange={(event) => {
            setSelectedEquipment(
              normalizeAtlasMultiSelectValue(
                event.target.value,
              ) as EquipmentType[],
            );
          }}
          select
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Stack direction='row' spacing={0.5} useFlexGap flexWrap='wrap'>
                {(selected as string[]).map((equipment) => (
                  <Chip
                    key={equipment}
                    label={formatAtlasToken(equipment)}
                    size='small'
                  />
                ))}
              </Stack>
            ),
          }}
          sx={{ minWidth: { xs: '100%', sm: 200 } }}
          value={filters.selectedEquipment}
        >
          {filterOptions.equipment.map((equipment) => (
            <MenuItem key={equipment} value={equipment}>
              {formatAtlasToken(equipment)}
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
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: 6,
        }}
      >
        <DataGrid
          aria-label={translations.title}
          autoHeight
          columns={columns}
          disableColumnMenu
          disableRowSelectionOnClick
          disableVirtualization
          initialState={initialState}
          pageSizeOptions={[10, 25, 50]}
          rows={filteredRows}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'background.default',
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Stack
                alignItems='center'
                justifyContent='center'
                sx={{ minHeight: 160, px: 3 }}
              >
                <Typography color='text.secondary'>
                  {translations.emptyState}
                </Typography>
              </Stack>
            ),
          }}
        />
      </Paper>
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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    >
      <Stack spacing={1}>
        <Typography variant='h6'>{title}</Typography>
        <Typography color='text.secondary'>{description}</Typography>
      </Stack>
    </Paper>
  );
}

function AtlasGridPlaceholder() {
  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: 240,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    />
  );
}
