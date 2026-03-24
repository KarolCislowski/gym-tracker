'use client';

import { useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Chip, Collapse, Stack, Typography } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { WorkoutTemplateSummary } from '../domain/workout.types';
import { WorkoutReportForm } from './workout-report-form';

interface WorkoutReportComposerProps {
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  initiallyOpen?: boolean;
  templates: WorkoutTemplateSummary[];
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
  templates,
  translations,
}: WorkoutReportComposerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const t = translations.workouts;
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? null;

  return (
    <Stack spacing={2}>
      {templates.length ? (
        <Stack spacing={1}>
          <Typography component='h2' variant='h6'>
            {t.quickStartTitle}
          </Typography>
          <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
            <Chip
              color={selectedTemplateId == null ? 'primary' : 'default'}
              label={t.blankWorkoutLabel}
              onClick={() => {
                setSelectedTemplateId(null);
                setIsOpen(true);
              }}
            />
            {templates.map((template) => (
              <Chip
                color={selectedTemplateId === template.id ? 'primary' : 'default'}
                key={template.id}
                label={template.name}
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setIsOpen(true);
                }}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}

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
          initialTemplate={selectedTemplate}
          key={selectedTemplate?.id ?? 'blank-workout'}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
