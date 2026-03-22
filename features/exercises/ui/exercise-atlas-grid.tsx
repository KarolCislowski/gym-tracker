'use client';

import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  EquipmentType,
  Exercise,
  ExerciseDifficulty,
  ExerciseType,
  MovementPattern,
} from '../domain/exercise.types';
import {
  formatAtlasToken,
  normalizeAtlasMultiSelectValue,
  useExerciseAtlasGrid,
  useExerciseAtlasGridColumns,
} from './use-exercise-atlas-grid';

interface ExerciseAtlasGridProps {
  exercises: Exercise[];
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
  translations,
}: ExerciseAtlasGridProps) {
  const {
    filteredRows,
    filterOptions,
    filters,
    resetFilters,
    setSearch,
    setSelectedDifficulties,
    setSelectedEquipment,
    setSelectedPatterns,
    setSelectedPrimaryMuscles,
    setSelectedTypes,
  } = useExerciseAtlasGrid(exercises);
  const columns = useExerciseAtlasGridColumns(translations);

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
          pageSizeOptions={[10, 25, 50]}
          rows={filteredRows}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
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
