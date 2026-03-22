import { Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Exercise } from '../domain/exercise.types';

import { ExerciseAtlasGrid } from './exercise-atlas-grid';

interface ExerciseAtlasPageProps {
  exercises: Exercise[];
  translations: TranslationDictionary;
}

/**
 * Server-rendered page shell for the shared exercise atlas.
 * @param props - Component props for the atlas page.
 * @param props.exercises - Exercises loaded from the shared Core atlas.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the atlas heading and data grid.
 */
export function ExerciseAtlasPage({
  exercises,
  translations,
}: ExerciseAtlasPageProps) {
  const t = translations.exercises;

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component='h1' variant='h3'>
          {t.title}
        </Typography>
        <Typography color='text.secondary'>{t.description}</Typography>
      </Stack>
      <ExerciseAtlasGrid exercises={exercises} translations={t} />
    </Stack>
  );
}
