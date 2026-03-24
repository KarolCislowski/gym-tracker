import {
  Alert,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  WorkoutSessionSummary,
  WorkoutTemplateSummary,
} from '../domain/workout.types';
import { WorkoutReportComposer } from './workout-report-composer';
import { WorkoutTemplateComposer } from './workout-template-composer';

interface WorkoutReportsPageProps {
  error?: string;
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
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
  reports,
  status,
  templates,
  translations,
}: WorkoutReportsPageProps) {
  const t = translations.workouts;
  const feedback = status === 'workout-report-created'
    ? { severity: 'success' as const, message: t.reportCreated }
    : status === 'workout-template-created'
      ? { severity: 'success' as const, message: t.templateCreated }
    : error
      ? { severity: 'error' as const, message: t.reportError }
      : null;

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component='h1' variant='h3'>
          {t.title}
        </Typography>
        <Typography color='text.secondary'>{t.description}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <WorkoutReportComposer
        exercises={exercises}
        favoriteExerciseSlugs={favoriteExerciseSlugs}
        initiallyOpen={Boolean(error)}
        templates={templates}
        translations={translations}
      />

      <WorkoutTemplateComposer exercises={exercises} translations={translations} />

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={1}>
          <Typography component='h2' variant='h6'>
            {t.modelTitle}
          </Typography>
          <Typography color='text.secondary'>{t.modelDescription}</Typography>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id} hover>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.blockCount}</TableCell>
                      <TableCell>{template.exerciseCount}</TableCell>
                      <TableCell>{template.notes ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color='text.secondary'>{t.templatesEmptyState}</Typography>
          )}
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>{report.workoutName}</TableCell>
                    <TableCell>{new Date(report.performedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      {report.durationMinutes != null ? `${report.durationMinutes} min` : '—'}
                    </TableCell>
                    <TableCell>{report.blockCount}</TableCell>
                    <TableCell>{report.exerciseCount}</TableCell>
                    <TableCell>{report.notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color='text.secondary'>{t.emptyState}</Typography>
        )}
      </Paper>
    </Stack>
  );
}
