'use client';

import { useMemo, useState } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Paper, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Exercise } from '../domain/exercise.types';

interface ExerciseAtlasGridProps {
  exercises: Exercise[];
  translations: TranslationDictionary['exercises'];
}

interface ExerciseAtlasRow {
  difficulty: string;
  equipment: string;
  id: string;
  movementPattern: string;
  name: string;
  primaryMuscles: string;
  type: string;
  variants: number;
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
  const [search, setSearch] = useState('');

  const rows = useMemo<ExerciseAtlasRow[]>(
    () =>
      exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        type: exercise.type,
        movementPattern: exercise.movementPattern,
        difficulty: exercise.difficulty,
        primaryMuscles: exercise.muscles
          .filter((muscle) => muscle.role === 'primary')
          .map((muscle) => muscle.muscleGroupId)
          .join(', '),
        variants: exercise.variants.length,
        equipment: Array.from(
          new Set(exercise.variants.flatMap((variant) => variant.equipment)),
        ).join(', '),
      })),
    [exercises],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      [
        row.name,
        row.type,
        row.movementPattern,
        row.difficulty,
        row.primaryMuscles,
        row.equipment,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [rows, search]);

  const columns = useMemo<GridColDef<ExerciseAtlasRow>[]>(
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
    ],
    [translations],
  );

  return (
    <Stack spacing={2.5}>
      <TextField
        aria-label={translations.searchPlaceholder}
        label={translations.searchPlaceholder}
        onChange={(event) => setSearch(event.target.value)}
        value={search}
      />
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
