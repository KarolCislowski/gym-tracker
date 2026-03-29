import { Alert, Paper, Stack, Typography } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';
import { DeleteConfirmationButton } from '@/shared/ui/delete-confirmation-button';

import type {
  WorkoutTemplateBlockInput,
  WorkoutTemplateSummary,
} from '../domain/workout.types';
import { deleteWorkoutTemplateAction } from '../infrastructure/workout.actions';
import { WorkoutTemplateEditor } from './workout-template-editor';

interface WorkoutTemplateDetailsPageProps {
  error?: string;
  exercises: Exercise[];
  status?: string;
  template: WorkoutTemplateSummary | null;
  translations: TranslationDictionary;
}

/**
 * Server-rendered detail page for a saved workout template with inline editing and deletion.
 * @param props - Component props for the workout-template detail page.
 * @param props.template - Persisted template details for the selected identifier.
 * @param props.exercises - Exercise atlas entries used to resolve display names and editor inputs.
 * @param props.translations - Full translation dictionary for localized copy.
 * @param props.status - Optional route status flag used for success feedback.
 * @param props.error - Optional route error flag used for failure feedback.
 * @returns A React element rendering the template summary, blocks, and edit/delete actions.
 */
export function WorkoutTemplateDetailsPage({
  error,
  exercises,
  status,
  template,
  translations,
}: WorkoutTemplateDetailsPageProps) {
  const t = translations.workouts;
  const feedback = status === 'workout-template-updated'
    ? { severity: 'success' as const, message: t.templateUpdated }
    : error
      ? { severity: 'error' as const, message: t.templateError }
      : null;

  if (!template) {
    return (
      <Stack spacing={2}>
        <Typography component='h1' variant='h3'>
          {t.templateNotFoundTitle}
        </Typography>
        <Typography color='text.secondary'>{t.templateNotFoundDescription}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Stack
          alignItems='center'
          direction='row'
          justifyContent='space-between'
          spacing={1.5}
        >
          <Typography component='h1' variant='h3'>
            {t.templateDetailsTitle}
          </Typography>
          <DeleteConfirmationButton
            action={deleteWorkoutTemplateAction}
            ariaLabel={`${t.deleteTemplateLabel}: ${template.name}`}
            cancelLabel={translations.profile.cancelEditing}
            confirmLabel={t.confirmDeleteLabel}
            description={t.deleteTemplateDescription}
            hiddenFields={{ templateId: template.id }}
            title={t.deleteTemplateTitle}
            tooltipLabel={t.deleteTemplateLabel}
          />
        </Stack>
        <Typography color='text.secondary'>{template.name}</Typography>
        <Typography color='text.secondary'>{t.templateDetailsDescription}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <WorkoutTemplateEditor
        exercises={exercises}
        initialTemplate={template}
        initiallyOpen={Boolean(error)}
        translations={translations}
      />

      <Stack
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 0.8fr) minmax(0, 1.2fr)' },
        }}
      >
        <DetailsSection
          rows={[
            [t.templateNameLabel, template.name],
            [t.columnBlocks, String(template.blockCount)],
            [t.columnExercises, String(template.exerciseCount)],
            [t.columnNotes, template.notes ?? translations.profile.emptyValue],
          ]}
          title={t.templateSummaryTitle}
        />

        <AppCard padding='md' radius='lg' tone='standard'>
          <Stack spacing={2}>
            <Typography component='h2' variant='h6'>
              {t.blocksLabel}
            </Typography>
            {template.blocks.map((block) => (
              <TemplateBlockDetails
                block={block}
                exercises={exercises}
                key={`${block.order}-${block.name ?? block.type}`}
                translations={translations}
              />
            ))}
          </Stack>
        </AppCard>
      </Stack>
    </Stack>
  );
}

/**
 * Summary card used on the workout-template detail page for key-value rows.
 * @param props - Component props for the reusable details section.
 * @param props.rows - Ordered label/value pairs to render.
 * @param props.title - Section title displayed above the rows.
 * @returns A React element rendering the summary section.
 */
function DetailsSection({
  rows,
  title,
}: {
  rows: readonly (readonly [string, string])[];
  title: string;
}) {
  return (
    <AppCard padding='md' radius='lg' tone='standard'>
      <Stack spacing={1.5}>
        <Typography component='h2' variant='h6'>
          {title}
        </Typography>
        {rows.map(([label, value]) => (
          <Stack
            direction='row'
            justifyContent='space-between'
            key={label}
            spacing={2}
            sx={{ borderBottom: 1, borderColor: 'divider', py: 0.75 }}
          >
            <Typography color='text.secondary' variant='body2'>
              {label}
            </Typography>
            <Typography sx={{ textAlign: 'right' }} variant='body2'>
              {value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </AppCard>
  );
}

/**
 * Renders a single template block with its exercise entries.
 * @param props - Component props for the template block details section.
 * @param props.block - Workout template block snapshot being displayed.
 * @param props.exercises - Exercise atlas entries used to resolve exercise names.
 * @param props.translations - Full translation dictionary for localized labels.
 * @returns A React element rendering block metadata and template entries.
 */
function TemplateBlockDetails({
  block,
  exercises,
  translations,
}: {
  block: WorkoutTemplateBlockInput;
  exercises: Exercise[];
  translations: TranslationDictionary;
}) {
  const t = translations.workouts;

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 4, p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant='subtitle1'>
          {block.name ?? `${t.blockTypeLabel} ${block.order}`}
        </Typography>
        <Typography color='text.secondary' variant='body2'>
          {resolveBlockTypeLabel(block.type, t)}
        </Typography>
        {block.entries.map((entry) => {
          const exercise = exercises.find((candidate) => candidate.slug === entry.exerciseSlug);

          return (
            <Paper
              elevation={0}
              key={`${block.order}-${entry.order}-${entry.exerciseSlug}`}
              sx={{ bgcolor: 'background.default', border: 1, borderColor: 'divider', borderRadius: 3, p: 1.5 }}
            >
              <Stack spacing={1}>
                <Typography variant='subtitle2'>
                  {exercise?.name ?? entry.exerciseSlug}
                </Typography>
                <Typography color='text.secondary' variant='body2'>
                  {entry.variantId ?? translations.profile.emptyValue}
                </Typography>
                {entry.notes ? <Typography variant='body2'>{entry.notes}</Typography> : null}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Paper>
  );
}

/**
 * Maps a stored workout template block type to a localized label.
 * @param type - Stored workout template block type.
 * @param translations - Workout translation slice containing block labels.
 * @returns A localized block type label.
 */
function resolveBlockTypeLabel(
  type: WorkoutTemplateBlockInput['type'],
  translations: TranslationDictionary['workouts'],
): string {
  switch (type) {
    case 'single':
      return translations.blockTypeSingle;
    case 'superset':
      return translations.blockTypeSuperset;
    case 'circuit':
      return translations.blockTypeCircuit;
    case 'dropset':
      return translations.blockTypeDropset;
    default:
      return type;
  }
}
