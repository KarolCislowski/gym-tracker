import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Link from 'next/link';
import { Button, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { ExerciseFavoriteButton } from './exercise-favorite-button';

interface ExerciseDetailsHeaderProps {
  exerciseName: string;
  exerciseSlug: string;
  isFavorite: boolean;
  translations: TranslationDictionary['exercises'];
}

/**
 * Header section for the exercise details page.
 * @param props - Component props for the header.
 * @param props.exerciseName - Name of the exercise being presented.
 * @param props.translations - Localized exercise translations.
 * @returns A React element rendering the back action and page heading.
 */
export function ExerciseDetailsHeader({
  exerciseName,
  exerciseSlug,
  isFavorite,
  translations,
}: ExerciseDetailsHeaderProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent='space-between'
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Link href='/exercises'>
          <Button startIcon={<ArrowBackRoundedIcon />} variant='outlined'>
            {translations.backToAtlas}
          </Button>
        </Link>
        <ExerciseFavoriteButton
          exerciseName={exerciseName}
          exerciseSlug={exerciseSlug}
          isFavorite={isFavorite}
          size='medium'
          translations={translations}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography component='h1' variant='h3'>
          {exerciseName}
        </Typography>
        <Typography color='text.secondary'>
          {translations.detailsDescription}
        </Typography>
      </Stack>
    </Stack>
  );
}
