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

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { DailyReportSummary } from '../domain/daily-report.types';
import { DailyReportForm } from './daily-report-form';

interface DailyReportsPageProps {
  error?: string;
  reports: DailyReportSummary[];
  status?: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Server-rendered page for browsing daily check-in reports.
 * @param props - Component props for the daily reports page.
 * @param props.reports - Daily report summaries loaded for the authenticated user.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the daily report overview table.
 */
export function DailyReportsPage({
  error,
  reports,
  status,
  translations,
  userSnapshot,
}: DailyReportsPageProps) {
  const t = translations.dailyReports;
  const profileT = translations.profile;
  const feedback = status === 'daily-report-created'
    ? { severity: 'success' as const, message: t.reportCreated }
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

      <DailyReportForm translations={translations} userSnapshot={userSnapshot} />

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={1}>
          <Typography component='h2' variant='h6'>
            {t.modelTitle}
          </Typography>
          <Typography color='text.secondary'>{t.modelDescription}</Typography>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        {reports.length ? (
          <TableContainer>
            <Table aria-label={t.title} size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>{t.columnDate}</TableCell>
                  <TableCell>{t.columnMood}</TableCell>
                  <TableCell>{t.columnEnergy}</TableCell>
                  <TableCell>{t.columnStress}</TableCell>
                  <TableCell>{t.columnRecovery}</TableCell>
                  <TableCell>{t.columnSteps}</TableCell>
                  <TableCell>{t.columnProtein}</TableCell>
                  <TableCell>{t.columnSleepGoal}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>{new Date(report.reportDate).toLocaleDateString()}</TableCell>
                    <TableCell>{report.wellbeing.mood ?? '—'}</TableCell>
                    <TableCell>{report.wellbeing.energy ?? '—'}</TableCell>
                    <TableCell>{report.wellbeing.stress ?? '—'}</TableCell>
                    <TableCell>{report.wellbeing.recovery ?? '—'}</TableCell>
                    <TableCell>{report.actuals.steps ?? '—'}</TableCell>
                    <TableCell>
                      {report.actuals.proteinGrams != null
                        ? `${report.actuals.proteinGrams} g`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {report.completion.sleepGoalMet == null
                        ? profileT.emptyValue
                        : report.completion.sleepGoalMet
                          ? translations.exercises.yesLabel
                          : translations.exercises.noLabel}
                    </TableCell>
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
