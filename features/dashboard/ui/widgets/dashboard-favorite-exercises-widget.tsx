import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import { formatAtlasToken } from '@/features/exercises/application/exercise-atlas-grid';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardFavoriteExercisesWidgetProps {
  exercises: Exercise[];
  translations: TranslationDictionary;
}

/**
 * Dashboard widget listing the authenticated user's favorite exercises.
 * @param props - Component props for the favorite exercises widget.
 * @param props.exercises - Favorite exercises resolved from the shared atlas.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering a compact favorites table.
 */
export function DashboardFavoriteExercisesWidget({
  exercises,
  translations,
}: DashboardFavoriteExercisesWidgetProps) {
  const dashboardTranslations = translations.dashboard;
  const exerciseTranslations = translations.exercises;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <FavoriteRoundedIcon color='primary' fontSize='small' />
          <Typography component='h2' variant='h6'>
            {dashboardTranslations.favoriteExercises}
          </Typography>
        </Stack>
        {exercises.length ? (
          <TableContainer>
            <Table aria-label={dashboardTranslations.favoriteExercises} size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>{exerciseTranslations.columnExercise}</TableCell>
                  <TableCell>{exerciseTranslations.columnType}</TableCell>
                  <TableCell>{exerciseTranslations.columnDifficulty}</TableCell>
                  <TableCell align='right'>{exerciseTranslations.columnActions}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id} hover>
                    <TableCell component='th' scope='row'>
                      {exercise.name}
                    </TableCell>
                    <TableCell>{formatAtlasToken(exercise.type)}</TableCell>
                    <TableCell>{formatAtlasToken(exercise.difficulty)}</TableCell>
                    <TableCell align='right'>
                      <Button
                        aria-label={`${exerciseTranslations.viewDetails}: ${exercise.name}`}
                        href={`/exercises/${exercise.slug}`}
                        size='small'
                        startIcon={<VisibilityRoundedIcon />}
                        variant='outlined'
                      >
                        {exerciseTranslations.viewDetails}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color='text.secondary'>
            {dashboardTranslations.favoriteExercisesEmpty}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
