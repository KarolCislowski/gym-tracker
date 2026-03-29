import { Alert, Paper, Stack, Typography } from '@mui/material';

import { formatSupplementToken } from '@/features/supplements/application/supplement-atlas-grid';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';
import { DeleteConfirmationButton } from '@/shared/ui/delete-confirmation-button';

import type {
  SupplementIntakeReportSummary,
  SupplementStackSummary,
} from '../domain/supplementation.types';
import { deleteSupplementIntakeReportAction } from '../infrastructure/supplementation.actions';
import { SupplementIntakeEditor } from './supplement-intake-editor';

interface SupplementIntakeDetailsPageProps {
  error?: string;
  report: SupplementIntakeReportSummary | null;
  stacks: SupplementStackSummary[];
  status?: string;
  translations: TranslationDictionary;
}

/**
 * Server-rendered detail page for a supplementation report with inline editing and deletion.
 * @param props - Component props for the supplementation-report detail page.
 * @param props.report - Persisted supplementation report details for the selected identifier.
 * @param props.stacks - Saved supplement stacks available to prefill report editing controls.
 * @param props.translations - Full translation dictionary for localized copy.
 * @param props.status - Optional route status flag used for success feedback.
 * @param props.error - Optional route error flag used for failure feedback.
 * @returns A React element rendering the report summary, taken items, and edit/delete actions.
 */
export function SupplementIntakeDetailsPage({
  error,
  report,
  stacks,
  status,
  translations,
}: SupplementIntakeDetailsPageProps) {
  const t = translations.supplementation;
  const feedback = status === 'supplement-report-updated'
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
        <Typography color='text.secondary'>
          {new Date(report.takenAt).toLocaleString()}
        </Typography>
        <Typography color='text.secondary'>{t.detailsDescription}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <SupplementIntakeEditor
        initialReport={report}
        initiallyOpen={Boolean(error)}
        stacks={stacks}
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
            [t.columnTakenAt, new Date(report.takenAt).toLocaleString()],
            [t.columnStack, report.stackName],
            [t.columnContext, formatSupplementToken(report.context)],
            [t.columnItems, String(report.itemCount)],
            [t.columnNotes, report.notes ?? translations.profile.emptyValue],
          ]}
          title={t.summaryTitle}
        />

        <AppCard padding='md' radius='lg' tone='standard'>
          <Stack spacing={2}>
            <Typography component='h2' variant='h6'>
              {t.stackItemsTitle}
            </Typography>
            {report.items.map((item) => (
              <Paper
                elevation={0}
                key={`${report.id}-${item.order}-${item.supplementSlug}`}
                sx={{ bgcolor: 'background.default', border: 1, borderColor: 'divider', borderRadius: 4, p: 2 }}
              >
                <Stack spacing={1}>
                  <Typography variant='subtitle2'>
                    {item.supplementName}
                    {item.variantName ? ` · ${item.variantName}` : ''}
                  </Typography>
                  <Typography color='text.secondary' variant='body2'>
                    {`${item.amount} ${item.unit}`}
                  </Typography>
                  {item.notes ? <Typography variant='body2'>{item.notes}</Typography> : null}
                </Stack>
              </Paper>
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
