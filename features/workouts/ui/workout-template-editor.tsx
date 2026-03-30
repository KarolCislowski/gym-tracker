'use client';

import { useId, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { WorkoutTemplateSummary } from '../domain/workout.types';
import { updateWorkoutTemplateAction } from '../infrastructure/workout.actions';
import { WorkoutTemplateForm } from './workout-template-form';

interface WorkoutTemplateEditorProps {
  exercises: Exercise[];
  initialTemplate: WorkoutTemplateSummary;
  initiallyOpen?: boolean;
  translations: TranslationDictionary;
}

export function WorkoutTemplateEditor({
  exercises,
  initialTemplate,
  initiallyOpen = false,
  translations,
}: WorkoutTemplateEditorProps) {
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
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <EditRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeTemplateEditLabel : t.openTemplateEditLabel}
      </Button>

      <Collapse
        aria-labelledby={buttonId}
        id={panelId}
        in={isOpen}
        role='region'
        timeout='auto'
        unmountOnExit
      >
        <WorkoutTemplateForm
          exercises={exercises}
          formAction={updateWorkoutTemplateAction}
          initialTemplate={initialTemplate}
          onCancel={() => setIsOpen(false)}
          submitLabel={t.updateTemplate}
          templateId={initialTemplate.id}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
