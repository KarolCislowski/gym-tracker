'use client';

import { useId, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  WorkoutSessionDetails,
  WorkoutTemplateSummary,
} from '../domain/workout.types';
import { updateWorkoutReportAction } from '../infrastructure/workout.actions';
import { WorkoutReportForm } from './workout-report-form';

interface WorkoutReportEditorProps {
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  initialReport: WorkoutSessionDetails;
  initiallyOpen?: boolean;
  templates: WorkoutTemplateSummary[];
  translations: TranslationDictionary;
}

export function WorkoutReportEditor({
  exercises,
  favoriteExerciseSlugs,
  initialReport,
  initiallyOpen = false,
  templates,
  translations,
}: WorkoutReportEditorProps) {
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
        {isOpen ? t.closeEditLabel : t.openEditLabel}
      </Button>

      <Collapse
        aria-labelledby={buttonId}
        id={panelId}
        in={isOpen}
        role='region'
        timeout='auto'
        unmountOnExit
      >
        <WorkoutReportForm
          exercises={exercises}
          favoriteExerciseSlugs={favoriteExerciseSlugs}
          formAction={updateWorkoutReportAction}
          initialReport={initialReport}
          initialTemplate={templates.find((template) => template.name === initialReport.workoutName) ?? null}
          reportId={initialReport.id}
          submitLabel={t.updateReport}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
