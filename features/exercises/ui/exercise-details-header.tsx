import Link from 'next/link';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Button, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface ExerciseDetailsHeaderProps {
  exerciseName: string;
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
  translations,
}: ExerciseDetailsHeaderProps) {
  return (
    <Stack spacing={2}>
      <Link href='/exercises'>
        <Button startIcon={<ArrowBackRoundedIcon />} variant='outlined'>
          {translations.backToAtlas}
        </Button>
      </Link>
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
