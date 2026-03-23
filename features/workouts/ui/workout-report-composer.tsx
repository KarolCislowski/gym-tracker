'use client';

import { useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { WorkoutReportForm } from './workout-report-form';

interface WorkoutReportComposerProps {
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  initiallyOpen?: boolean;
  translations: TranslationDictionary;
}

/**
 * Client-side toggle wrapper that reveals the workout report form only on demand.
 * @param props - Component props for the workout report composer.
 * @param props.exercises - Atlas exercises available in the workout form.
 * @param props.initiallyOpen - Whether the form should start expanded.
 * @param props.translations - Translation dictionary for localized labels.
 * @returns A React element rendering the toggle button and collapsible form.
 */
export function WorkoutReportComposer({
  exercises,
  favoriteExerciseSlugs,
  initiallyOpen = false,
  translations,
}: WorkoutReportComposerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const t = translations.workouts;

  return (
    <Stack spacing={2}>
      <Button
        onClick={() => setIsOpen((current) => !current)}
        size='large'
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <AddRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeComposerLabel : t.openComposerLabel}
      </Button>

      <Collapse in={isOpen} timeout='auto' unmountOnExit>
        <WorkoutReportForm
          exercises={exercises}
          favoriteExerciseSlugs={favoriteExerciseSlugs}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
