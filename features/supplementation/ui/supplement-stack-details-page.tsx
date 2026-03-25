import { Alert, Chip, Paper, Stack, Typography } from '@mui/material';

import { formatSupplementToken } from '@/features/supplements/application/supplement-atlas-grid';
import type { Supplement } from '@/features/supplements/domain/supplement.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { DeleteConfirmationButton } from '@/shared/ui/delete-confirmation-button';

import type { SupplementStackSummary } from '../domain/supplementation.types';
import { deleteSupplementStackAction } from '../infrastructure/supplementation.actions';
import { SupplementStackEditor } from './supplement-stack-editor';

interface SupplementStackDetailsPageProps {
  error?: string;
  stack: SupplementStackSummary | null;
  status?: string;
  supplements: Supplement[];
  translations: TranslationDictionary;
}

/**
 * Server-rendered detail page for a saved supplement stack with inline editing and deletion.
 * @param props - Component props for the supplement-stack detail page.
 * @param props.stack - Persisted stack details for the selected identifier.
 * @param props.supplements - Atlas entries used to prefill stack editing controls.
 * @param props.translations - Full translation dictionary for localized copy.
 * @param props.status - Optional route status flag used for success feedback.
 * @param props.error - Optional route error flag used for failure feedback.
 * @returns A React element rendering the stack summary, items, and edit/delete actions.
 */
export function SupplementStackDetailsPage({
  error,
  stack,
  status,
  supplements,
  translations,
}: SupplementStackDetailsPageProps) {
  const t = translations.supplementation;
  const feedback = status === 'supplement-stack-updated'
    ? { severity: 'success' as const, message: t.stackUpdated }
    : error
      ? { severity: 'error' as const, message: t.errorGeneric }
      : null;

  if (!stack) {
    return (
      <Stack spacing={2}>
        <Typography component='h1' variant='h3'>
          {t.stackNotFoundTitle}
        </Typography>
        <Typography color='text.secondary'>{t.stackNotFoundDescription}</Typography>
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
            {t.stackDetailsTitle}
          </Typography>
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
        <Stack alignItems='center' direction='row' flexWrap='wrap' spacing={1}>
          <Typography color='text.secondary'>{stack.name}</Typography>
          {stack.isFavorite ? (
            <Chip color='warning' label={t.stackFavoriteLabel} size='small' />
          ) : null}
        </Stack>
        <Typography color='text.secondary'>{t.stackDetailsDescription}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

      <SupplementStackEditor
        initialStack={stack}
        initiallyOpen={Boolean(error)}
        supplements={supplements}
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
            [t.columnStack, stack.name],
            [t.columnContext, formatSupplementToken(stack.context)],
            [t.columnItems, String(stack.itemCount)],
            [t.columnNotes, stack.notes ?? translations.profile.emptyValue],
          ]}
          title={t.stackSummaryTitle}
        />

        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 6, p: 3 }}>
          <Stack spacing={2}>
            <Typography component='h2' variant='h6'>
              {t.stackItemsTitle}
            </Typography>
            {stack.items.map((item) => (
              <Paper
                elevation={0}
                key={`${stack.id}-${item.order}-${item.supplementSlug}`}
                sx={{
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 4,
                  p: 2,
                }}
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
        </Paper>
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
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 6, p: 3 }}>
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
    </Paper>
  );
}
