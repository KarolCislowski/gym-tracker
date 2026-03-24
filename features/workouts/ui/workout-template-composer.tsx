'use client';

import { useId, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { WorkoutTemplateForm } from './workout-template-form';

interface WorkoutTemplateComposerProps {
  exercises: Exercise[];
  initiallyOpen?: boolean;
  translations: TranslationDictionary;
}

/**
 * Client-side toggle wrapper that reveals the workout-template form only on demand.
 * @param props - Component props for the workout-template composer.
 * @param props.exercises - Atlas exercises available in the template form.
 * @param props.initiallyOpen - Whether the form should start expanded.
 * @param props.translations - Translation dictionary for localized labels.
 * @returns A React element rendering the toggle button and collapsible form.
 */
export function WorkoutTemplateComposer({
  exercises,
  initiallyOpen = false,
  translations,
}: WorkoutTemplateComposerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const t = translations.workouts;
  const buttonId = useId();
  const panelId = useId();

  return (
    <Stack spacing={2}>
      <Button
        aria-controls={panelId}
        aria-expanded={isOpen}
        id={buttonId}
        onClick={() => setIsOpen((current) => !current)}
        size='large'
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <AddRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeTemplateComposerLabel : t.openTemplateComposerLabel}
      </Button>

      <Collapse
        aria-labelledby={buttonId}
        id={panelId}
        in={isOpen}
        role='region'
        timeout='auto'
        unmountOnExit
      >
        <WorkoutTemplateForm exercises={exercises} translations={translations} />
      </Collapse>
    </Stack>
  );
}
