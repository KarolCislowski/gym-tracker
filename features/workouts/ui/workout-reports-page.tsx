import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {
  Alert,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import { OnboardingReplayButton } from '@/features/onboarding/ui/onboarding-replay-button';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';
import { DeleteConfirmationButton } from '@/shared/ui/delete-confirmation-button';

import type {
  WorkoutSessionDuplicateDraft,
  WorkoutSessionSummary,
  WorkoutTemplateSummary,
} from '../domain/workout.types';
import {
  deleteWorkoutReportAction,
  deleteWorkoutTemplateAction,
} from '../infrastructure/workout.actions';
import { WorkoutReportComposer } from './workout-report-composer';
import { WorkoutTemplateComposer } from './workout-template-composer';

interface WorkoutReportsPageProps {
  error?: string;
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  initialDuplicateDraft?: WorkoutSessionDuplicateDraft | null;
  reports: WorkoutSessionSummary[];
  status?: string;
  templates: WorkoutTemplateSummary[];
  translations: TranslationDictionary;
}

/**
 * Server-rendered page for browsing structured workout reports.
 * @param props - Component props for the workout reports page.
 * @param props.reports - Workout session summaries loaded for the authenticated user.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the workout reports overview.
 */
export function WorkoutReportsPage({
  error,
  exercises,
  favoriteExerciseSlugs,
  initialDuplicateDraft = null,
  reports,
  status,
  templates,
  translations,
}: WorkoutReportsPageProps) {
  const t = translations.workouts;
  const errorMessage = !error
    ? null
    : error.startsWith('WORKOUT_TEMPLATE_')
      ? t.templateError
      : t.reportError;
  const feedback = status === 'workout-report-created'
    ? { severity: 'success' as const, message: t.reportCreated }
    : status === 'workout-report-deleted'
      ? { severity: 'success' as const, message: t.reportDeleted }
    : status === 'workout-template-created'
      ? { severity: 'success' as const, message: t.templateCreated }
      : status === 'workout-template-deleted'
        ? { severity: 'success' as const, message: t.templateDeleted }
        : errorMessage
          ? { severity: 'error' as const, message: errorMessage }
          : null;

  return (
    <Stack spacing={3}>
      <Stack data-onboarding='workout-reports-page-header' spacing={1}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          spacing={1.5}
        >
          <Typography component='h1' variant='h3'>
            {t.title}
          </Typography>
          <OnboardingReplayButton label={translations.dashboard.replayOnboarding} />
        </Stack>
        <Typography color='text.secondary'>{t.description}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <WorkoutReportComposer
        exercises={exercises}
        favoriteExerciseSlugs={favoriteExerciseSlugs}
        initialDuplicateDraft={initialDuplicateDraft}
        initiallyOpen={Boolean(error) || Boolean(initialDuplicateDraft)}
        templates={templates}
        translations={translations}
      />

      <WorkoutTemplateComposer exercises={exercises} translations={translations} />

      <AppCard padding='md' radius='lg' tone='standard'>
        <Stack spacing={1}>
          <Typography component='h2' variant='h6'>
            {t.modelTitle}
          </Typography>
          <Typography color='text.secondary'>{t.modelDescription}</Typography>
        </Stack>
      </AppCard>

      <AppCard onboardingId='workout-templates-card' padding='md' radius='lg' tone='standard'>
        <Stack spacing={2}>
          <Typography component='h2' variant='h6'>
            {t.templatesTitle}
          </Typography>

          {templates.length ? (
            <TableContainer>
              <Table aria-label={t.templatesTitle} size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{t.templateNameLabel}</TableCell>
                    <TableCell>{t.columnBlocks}</TableCell>
                    <TableCell>{t.columnExercises}</TableCell>
                    <TableCell>{t.columnNotes}</TableCell>
                    <TableCell>{t.columnActions}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id} hover>
                      <TableCell component='th' scope='row'>
                        {template.name}
                      </TableCell>
                      <TableCell>{template.blockCount}</TableCell>
                      <TableCell>{template.exerciseCount}</TableCell>
                      <TableCell>{template.notes ?? '—'}</TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={0.5}>
                          <Tooltip title={t.templateViewDetailsLabel}>
                            <IconButton
                              aria-label={`${t.templateViewDetailsLabel}: ${template.name}`}
                              href={`/workouts/templates/${template.id}`}
                              size='small'
                            >
                              <VisibilityRoundedIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color='text.secondary'>{t.templatesEmptyState}</Typography>
          )}
        </Stack>
      </AppCard>

      <AppCard onboardingId='workout-reports-history' padding='md' radius='lg' tone='standard'>
        {reports.length ? (
          <TableContainer>
            <Table aria-label={t.title} size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>{t.columnWorkout}</TableCell>
                  <TableCell>{t.columnPerformedAt}</TableCell>
                  <TableCell>{t.columnDuration}</TableCell>
                  <TableCell>{t.columnBlocks}</TableCell>
                  <TableCell>{t.columnExercises}</TableCell>
                  <TableCell>{t.columnNotes}</TableCell>
                  <TableCell>{t.columnActions}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell component='th' scope='row'>
                      {report.workoutName}
                    </TableCell>
                    <TableCell>{new Date(report.performedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      {report.durationMinutes != null ? `${report.durationMinutes} min` : '—'}
                    </TableCell>
                    <TableCell>{report.blockCount}</TableCell>
                    <TableCell>{report.exerciseCount}</TableCell>
                    <TableCell>{report.notes ?? '—'}</TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={0.5}>
                        <Tooltip title={t.viewDetailsLabel}>
                          <IconButton
                            aria-label={`${t.viewDetailsLabel}: ${report.workoutName}`}
                            href={`/workouts/${report.id}`}
                            size='small'
                          >
                            <VisibilityRoundedIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t.duplicateReportLabel}>
                          <IconButton
                            aria-label={`${t.duplicateReportLabel}: ${report.workoutName}`}
                            href={`/workouts?duplicateReportId=${encodeURIComponent(report.id)}`}
                            size='small'
                          >
                            <ContentCopyRoundedIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color='text.secondary'>{t.emptyState}</Typography>
        )}
      </AppCard>
    </Stack>
  );
}
