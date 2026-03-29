import { Alert, Paper, Stack, Typography } from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';
import { DeleteConfirmationButton } from '@/shared/ui/delete-confirmation-button';

import type {
  WorkoutBlockInput,
  WorkoutSessionDetails,
  WorkoutTemplateSummary,
} from '../domain/workout.types';
import { deleteWorkoutReportAction } from '../infrastructure/workout.actions';
import { WorkoutReportEditor } from './workout-report-editor';

interface WorkoutReportDetailsPageProps {
  error?: string;
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  report: WorkoutSessionDetails | null;
  status?: string;
  templates: WorkoutTemplateSummary[];
  translations: TranslationDictionary;
}

export function WorkoutReportDetailsPage({
  error,
  exercises,
  favoriteExerciseSlugs,
  report,
  status,
  templates,
  translations,
}: WorkoutReportDetailsPageProps) {
  const t = translations.workouts;
  const feedback = status === 'workout-report-updated'
    ? { severity: 'success' as const, message: t.reportUpdated }
    : error
      ? { severity: 'error' as const, message: t.reportError }
      : null;

  if (!report) {
    return (
      <Stack spacing={2}>
        <Typography component='h1' variant='h3'>
          {t.notFoundTitle}
        </Typography>
        <Typography color='text.secondary'>{t.notFoundDescription}</Typography>
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
            {t.detailsTitle}
          </Typography>
          <DeleteConfirmationButton
            action={deleteWorkoutReportAction}
            ariaLabel={`${t.deleteReportLabel}: ${report.workoutName}`}
            cancelLabel={translations.profile.cancelEditing}
            confirmLabel={t.confirmDeleteLabel}
            description={t.deleteReportDescription}
            hiddenFields={{ reportId: report.id }}
            title={t.deleteReportTitle}
            tooltipLabel={t.deleteReportLabel}
          />
        </Stack>
        <Typography color='text.secondary'>{report.workoutName}</Typography>
        <Typography color='text.secondary'>
          {new Date(report.performedAt).toLocaleString()}
        </Typography>
        <Typography color='text.secondary'>{t.detailsDescription}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <WorkoutReportEditor
        exercises={exercises}
        favoriteExerciseSlugs={favoriteExerciseSlugs}
        initialReport={report}
        initiallyOpen={Boolean(error)}
        templates={templates}
        translations={translations}
      />

      <Stack
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 0.8fr) minmax(0, 1.2fr)' },
          alignItems: 'start',
        }}
      >
        <DetailsSection
          rows={[
            [t.workoutNameLabel, report.workoutName],
            [t.performedAtLabel, new Date(report.performedAt).toLocaleString()],
            [t.startedAtLabel, report.startedAt ? new Date(report.startedAt).toLocaleString() : translations.profile.emptyValue],
            [t.endedAtLabel, report.endedAt ? new Date(report.endedAt).toLocaleString() : translations.profile.emptyValue],
            [t.columnDuration, report.durationMinutes != null ? `${report.durationMinutes} min` : translations.profile.emptyValue],
            [t.columnBlocks, String(report.blocks.length)],
            [t.columnExercises, String(report.blocks.reduce((sum, block) => sum + block.entries.length, 0))],
            [t.columnNotes, report.notes ?? translations.profile.emptyValue],
          ]}
          title={t.summaryTitle}
        />

        <AppCard padding='md' radius='lg' tone='standard'>
          <Stack spacing={2}>
            <Typography component='h2' variant='h6'>
              {t.blocksLabel}
            </Typography>
            {report.blocks.map((block) => (
              <BlockDetails
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
            sx={{ py: 0.75, borderBottom: 1, borderColor: 'divider' }}
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

function BlockDetails({
  block,
  exercises,
  translations,
}: {
  block: WorkoutBlockInput;
  exercises: Exercise[];
  translations: TranslationDictionary;
}) {
  const t = translations.workouts;

  return (
    <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 4 }}>
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
              sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 3 }}
            >
              <Stack spacing={1}>
                <Typography variant='subtitle2'>
                  {exercise?.name ?? entry.exerciseSlug}
                </Typography>
                <Typography color='text.secondary' variant='body2'>
                  {entry.variantId ?? translations.profile.emptyValue}
                </Typography>
                {entry.notes ? <Typography variant='body2'>{entry.notes}</Typography> : null}
                {entry.sets.map((set) => (
                  <Typography
                    color='text.secondary'
                    key={`${entry.order}-${set.order}`}
                    variant='body2'
                  >
                    {formatSetLine(set, translations)}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Paper>
  );
}

function resolveBlockTypeLabel(
  type: WorkoutBlockInput['type'],
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

function formatSetLine(
  set: WorkoutBlockInput['entries'][number]['sets'][number],
  translations: TranslationDictionary,
): string {
  const emptyValue = translations.profile.emptyValue;
  const parts = [
    `Set ${set.order}`,
    set.reps != null ? `${set.reps} ${translations.workouts.repsLabel.toLowerCase()}` : null,
    set.weight != null ? `${set.weight} ${translations.workouts.weightLabel.toLowerCase()}` : null,
    set.durationSec != null ? `${set.durationSec}s` : null,
    set.distanceMeters != null ? `${set.distanceMeters}m` : null,
    set.rpe != null ? `RPE ${set.rpe}` : null,
    set.rir != null ? `RIR ${set.rir}` : null,
  ].filter(Boolean);

  return parts.length ? parts.join(' • ') : emptyValue;
}
