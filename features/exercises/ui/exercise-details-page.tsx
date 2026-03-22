import { Stack } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Exercise } from '../domain/exercise.types';

import { ExerciseDetailsHeader } from './exercise-details-header';
import { ExerciseDetailsListSection } from './exercise-details-list-section';
import { ExerciseDetailsOverviewSection } from './exercise-details-overview-section';
import { ExerciseDetailsVariantsSection } from './exercise-details-variants-section';

interface ExerciseDetailsPageProps {
  exercise: Exercise;
  translations: TranslationDictionary;
}

/**
 * Server-rendered details page for a single atlas exercise with variant comparison.
 * @param props - Component props for the exercise details page.
 * @param props.exercise - The atlas exercise to present.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering exercise details and a variant comparison table.
 */
export function ExerciseDetailsPage({
  exercise,
  translations,
}: ExerciseDetailsPageProps) {
  const t = translations.exercises;

  return (
    <Stack spacing={3}>
      <ExerciseDetailsHeader
        exerciseName={exercise.name}
        translations={t}
      />
      <ExerciseDetailsOverviewSection exercise={exercise} translations={t} />

      {exercise.instructions?.length ? (
        <ExerciseDetailsListSection
          title={t.sectionInstructions}
          values={exercise.instructions}
        />
      ) : null}
      {exercise.tips?.length ? (
        <ExerciseDetailsListSection title={t.sectionTips} values={exercise.tips} />
      ) : null}
      {exercise.commonMistakes?.length ? (
        <ExerciseDetailsListSection
          title={t.sectionMistakes}
          values={exercise.commonMistakes}
        />
      ) : null}
      <ExerciseDetailsVariantsSection exercise={exercise} translations={t} />
    </Stack>
  );
}
