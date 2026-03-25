import Link from 'next/link';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Alert,
  IconButton,
  Paper,
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

import { formatSupplementToken } from '@/features/supplements/application/supplement-atlas-grid';
import type { Supplement } from '@/features/supplements/domain/supplement.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { DeleteConfirmationButton } from '@/shared/ui/delete-confirmation-button';

import type {
  SupplementIntakeReportSummary,
  SupplementStackSummary,
} from '../domain/supplementation.types';
import {
  deleteSupplementIntakeReportAction,
  deleteSupplementStackAction,
} from '../infrastructure/supplementation.actions';
import { SupplementIntakeComposer } from './supplement-intake-composer';
import { SupplementStackComposer } from './supplement-stack-composer';

interface SupplementationPageProps {
  error?: string;
  reports: SupplementIntakeReportSummary[];
  stacks: SupplementStackSummary[];
  status?: string;
  supplements: Supplement[];
  translations: TranslationDictionary;
}

/**
 * Server-rendered page for managing supplement stacks and logging supplement intake.
 * @param props - Component props for the supplementation workspace.
 * @param props.stacks - User-owned supplement stacks available for reuse.
 * @param props.reports - Historical supplement-intake reports for the authenticated user.
 * @param props.supplements - Shared supplement atlas entries available for stack composition.
 * @param props.translations - Translation dictionary for the active language.
 * @returns A React element rendering stack management and intake-report history.
 */
export function SupplementationPage({
  error,
  reports,
  stacks,
  status,
  supplements,
  translations,
}: SupplementationPageProps) {
  const t = translations.supplementation;
  const feedback = status === 'supplement-stack-created'
    ? { severity: 'success' as const, message: t.stackCreated }
    : status === 'supplement-stack-deleted'
      ? { severity: 'success' as const, message: t.stackDeleted }
    : status === 'supplement-report-created'
      ? { severity: 'success' as const, message: t.reportCreated }
      : status === 'supplement-report-deleted'
        ? { severity: 'success' as const, message: t.reportDeleted }
        : error
          ? { severity: 'error' as const, message: t.errorGeneric }
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

      <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3} alignItems='flex-start'>
        <Stack spacing={2} sx={{ flex: 1, width: '100%' }}>
          <SupplementIntakeComposer
            initiallyOpen={Boolean(error)}
            stacks={stacks}
            translations={translations}
          />
          <SupplementStackComposer supplements={supplements} translations={translations} />
        </Stack>

        <Paper
          elevation={0}
          sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6, flex: 1, width: '100%' }}
        >
          <Stack spacing={1}>
            <Typography component='h2' variant='h6'>
              {t.modelTitle}
            </Typography>
            <Typography color='text.secondary'>{t.modelDescription}</Typography>
            <Typography color='text.secondary' variant='body2'>
              <Link href='/supplements'>{translations.supplements.backToAtlas}</Link>
            </Typography>
          </Stack>
        </Paper>
      </Stack>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={2}>
          <Typography component='h2' variant='h6'>
            {t.stacksSectionTitle}
          </Typography>

          {stacks.length ? (
            <TableContainer>
              <Table aria-label={t.stacksSectionTitle} size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{t.columnStack}</TableCell>
                    <TableCell>{t.columnContext}</TableCell>
                    <TableCell>{t.columnItems}</TableCell>
                    <TableCell>{t.columnNotes}</TableCell>
                    <TableCell>{t.columnActions}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stacks.map((stack) => (
                    <TableRow key={stack.id} hover>
                      <TableCell component='th' scope='row'>
                        <Typography variant='body2'>{stack.name}</Typography>
                      </TableCell>
                      <TableCell>{formatSupplementToken(stack.context)}</TableCell>
                      <TableCell>{stack.itemCount}</TableCell>
                      <TableCell>{stack.notes ?? translations.supplements.emptyValue}</TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={0.5}>
                          <Tooltip title={t.stackViewDetailsLabel}>
                            <IconButton
                              aria-label={`${t.stackViewDetailsLabel}: ${stack.name}`}
                              href={`/supplementation/stacks/${stack.id}`}
                              size='small'
                            >
                              <VisibilityRoundedIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                          <DeleteConfirmationButton
                            action={deleteSupplementStackAction}
                            ariaLabel={`${t.deleteStackLabel}: ${stack.name}`}
                            cancelLabel={translations.profile.cancelEditing}
                            confirmLabel={t.confirmDeleteLabel}
                            description={t.deleteStackDescription}
                            hiddenFields={{ stackId: stack.id }}
                            title={t.deleteStackTitle}
                            tooltipLabel={t.deleteStackLabel}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color='text.secondary'>{t.emptyStacks}</Typography>
          )}
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={2}>
          <Typography component='h2' variant='h6'>
            {t.reportsSectionTitle}
          </Typography>

          {reports.length ? (
            <TableContainer>
              <Table aria-label={t.reportsSectionTitle} size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{t.columnTakenAt}</TableCell>
                    <TableCell>{t.columnStack}</TableCell>
                    <TableCell>{t.columnContext}</TableCell>
                    <TableCell>{t.columnItems}</TableCell>
                    <TableCell>{t.columnNotes}</TableCell>
                    <TableCell>{t.columnActions}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell component='th' scope='row'>
                        {new Date(report.takenAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{report.stackName}</TableCell>
                      <TableCell>{formatSupplementToken(report.context)}</TableCell>
                      <TableCell>{report.itemCount}</TableCell>
                      <TableCell>{report.notes ?? translations.supplements.emptyValue}</TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={0.5}>
                          <Tooltip title={t.viewDetailsLabel}>
                            <IconButton
                              aria-label={`${t.viewDetailsLabel}: ${report.stackName}`}
                              href={`/supplementation/reports/${report.id}`}
                              size='small'
                            >
                              <VisibilityRoundedIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                          <DeleteConfirmationButton
                            action={deleteSupplementIntakeReportAction}
                            ariaLabel={`${t.deleteReportLabel}: ${report.stackName}`}
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
            <Typography color='text.secondary'>{t.emptyReports}</Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
