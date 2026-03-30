'use client';

import { useId, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Chip, Collapse, Stack, Typography } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  WorkoutSessionDuplicateDraft,
  WorkoutTemplateSummary,
} from '../domain/workout.types';
import { WorkoutReportForm } from './workout-report-form';

interface WorkoutReportComposerProps {
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  initialDuplicateDraft?: WorkoutSessionDuplicateDraft | null;
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
  initialDuplicateDraft = null,
  initiallyOpen = false,
  templates,
  translations,
}: WorkoutReportComposerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen || Boolean(initialDuplicateDraft));
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const t = translations.workouts;
  const buttonId = useId();
  const panelId = useId();
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? null;

  return (
    <Stack spacing={2}>
      {templates.length ? (
        <Stack data-onboarding='workout-quick-start' spacing={1}>
          <Typography component='h2' variant='h6'>
            {t.quickStartTitle}
          </Typography>
          <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
            <Chip
              aria-pressed={selectedTemplateId == null}
              clickable
              color={selectedTemplateId == null ? 'primary' : 'default'}
              component='button'
              label={t.blankWorkoutLabel}
              onClick={() => {
                setSelectedTemplateId(null);
                setIsOpen(true);
              }}
              type='button'
            />
            {templates.map((template) => (
              <Chip
                aria-pressed={selectedTemplateId === template.id}
                clickable
                color={selectedTemplateId === template.id ? 'primary' : 'default'}
                component='button'
                key={template.id}
                label={template.name}
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setIsOpen(true);
                }}
                type='button'
              />
            ))}
          </Stack>
        </Stack>
      ) : null}

      <Button
        aria-controls={panelId}
        aria-expanded={isOpen}
        data-onboarding='workout-create-action'
        id={buttonId}
        onClick={() => setIsOpen((current) => !current)}
        size='large'
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <AddRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeComposerLabel : t.openComposerLabel}
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
          initialDuplicateDraft={selectedTemplate ? null : initialDuplicateDraft}
          initialTemplate={selectedTemplate}
          onCancel={() => {
            setSelectedTemplateId(null);
            setIsOpen(false);
          }}
          key={selectedTemplate?.id ?? (initialDuplicateDraft ? 'duplicate-workout' : 'blank-workout')}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
