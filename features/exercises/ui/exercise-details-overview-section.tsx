import { Paper, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Exercise } from '../domain/exercise.types';
import { formatAtlasToken } from '../application/exercise-atlas-grid';

import { ExerciseDetailChips } from './exercise-detail-chips';

interface ExerciseDetailsOverviewSectionProps {
  exercise: Exercise;
  translations: TranslationDictionary['exercises'];
}

/**
 * Overview section for the exercise details page.
 * @param props - Component props for the overview section.
 * @param props.exercise - Exercise currently displayed on the details page.
 * @param props.translations - Localized exercise translations.
 * @returns A React element rendering description and summary chips.
 */
export function ExerciseDetailsOverviewSection({
  exercise,
  translations,
}: ExerciseDetailsOverviewSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 6 }}
    >
      <Stack spacing={2}>
        <Typography component='h2' variant='h6'>
          {translations.sectionOverview}
        </Typography>
        {exercise.description ? (
          <Typography color='text.secondary'>{exercise.description}</Typography>
        ) : null}
        <ExerciseDetailChips
          label={translations.aliasesLabel}
          values={exercise.aliases}
        />
        <ExerciseDetailChips
          label={translations.primaryMusclesLabel}
          values={exercise.muscles
            .filter((muscle) => muscle.role === 'primary')
            .map((muscle) => formatAtlasToken(muscle.muscleGroupId))}
        />
        <ExerciseDetailChips
          label={translations.goalsLabel}
          values={exercise.goals?.map(formatAtlasToken)}
        />
        <ExerciseDetailChips
          label={translations.tagsLabel}
          values={exercise.tags?.map(formatAtlasToken)}
        />
      </Stack>
    </Paper>
  );
}
