'use client';

import { useMemo, useState } from 'react';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Alert,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { formatSupplementToken } from '@/features/supplements/application/supplement-atlas-grid';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { useUnsavedChangesWarning } from '@/shared/ui/use-unsaved-changes-warning';

import type {
  SupplementIntakeReportSummary,
  SupplementStackSummary,
} from '../domain/supplementation.types';
import { createSupplementIntakeReportAction } from '../infrastructure/supplementation.actions';

interface SupplementIntakeFormProps {
  formAction?: (formData: FormData) => void | Promise<void>;
  initialReport?: SupplementIntakeReportSummary | null;
  reportId?: string;
  submitLabel?: string;
  stacks: SupplementStackSummary[];
  translations: TranslationDictionary;
}

/**
 * Mobile-first form for logging supplement intake from saved user stacks.
 * @param props - Component props for the supplement-intake form.
 * @param props.stacks - Reusable supplement stacks available to the authenticated user.
 * @param props.translations - Full translation dictionary for localized labels.
 * @returns A React element rendering a quick stack-based intake logger.
 */
export function SupplementIntakeForm({
  formAction = createSupplementIntakeReportAction,
  initialReport = null,
  reportId,
  submitLabel,
  stacks,
  translations,
}: SupplementIntakeFormProps) {
  const t = translations.supplementation;
  const { formRef, markSubmitted } = useUnsavedChangesWarning({
    message: translations.common.unsavedChangesWarning,
  });
  const sortedStacks = useMemo(
    () =>
      [...stacks].sort((left, right) => {
        if (left.isFavorite !== right.isFavorite) {
          return left.isFavorite ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      }),
    [stacks],
  );
  const [stackId, setStackId] = useState(
    initialReport?.stackId ?? sortedStacks[0]?.id ?? '',
  );
  const [takenAt, setTakenAt] = useState(
    initialReport
      ? formatDateTimeLocal(new Date(initialReport.takenAt))
      : formatDateTimeLocal(new Date()),
  );
  const [notes, setNotes] = useState(initialReport?.notes ?? '');
  const selectedStack =
    sortedStacks.find((stack) => stack.id === stackId) ??
    (initialReport
      ? {
          id: initialReport.stackId ?? `report-${initialReport.id}`,
          name: initialReport.stackName,
          context: initialReport.context,
          notes: initialReport.notes,
          isFavorite: false,
          itemCount: initialReport.itemCount,
          items: initialReport.items,
        }
      : null);

  const payload = useMemo(
    () =>
      JSON.stringify({
        takenAt: new Date(takenAt).toISOString(),
        stackId: selectedStack?.id ?? null,
        stackName: selectedStack?.name ?? '',
        context: selectedStack?.context ?? 'custom',
        notes: notes.trim() || null,
        items: (selectedStack?.items ?? []).map((item) => ({
          ...item,
          notes: item.notes ?? null,
        })),
      }),
    [notes, selectedStack, takenAt],
  );

  return (
    <Stack
      component='form'
      action={formAction}
      onSubmitCapture={markSubmitted}
      ref={formRef}
      spacing={2.5}
    >
      <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={2}>
          <Typography component='h2' variant='h6'>
            {t.addReportTitle}
          </Typography>
          <Typography color='text.secondary'>{t.addReportDescription}</Typography>

          {sortedStacks.length === 0 ? (
            <Alert severity='info' variant='outlined'>
              {t.noStacksHint}
            </Alert>
          ) : (
            <>
              <TextField
                label={t.reportStackLabel}
                onChange={(event) => setStackId(event.target.value)}
                required
                select
                value={stackId}
              >
                {sortedStacks.map((stack) => (
                  <MenuItem key={stack.id} value={stack.id}>
                    {stack.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t.reportTakenAtLabel}
                onChange={(event) => setTakenAt(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                type='datetime-local'
                value={takenAt}
              />
              <TextField
                label={t.reportNotesLabel}
                minRows={3}
                multiline
                onChange={(event) => setNotes(event.target.value)}
                value={notes}
              />
            </>
          )}
        </Stack>
      </Paper>

      {selectedStack ? (
        <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}>
          <Stack spacing={2}>
            <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
              <Typography component='h3' variant='subtitle1'>
                {selectedStack.name}
              </Typography>
              <Chip
                label={formatSupplementToken(selectedStack.context)}
                size='small'
                variant='outlined'
              />
            </Stack>
            <List dense disablePadding>
              {selectedStack.items.map((item) => (
                <ListItem divider key={`${selectedStack.id}-${item.order}`} disableGutters>
                  <ListItemText
                    primary={`${item.supplementName}${item.variantName ? ` · ${item.variantName}` : ''}`}
                    secondary={`${item.amount} ${item.unit}${item.notes ? ` · ${item.notes}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          </Stack>
        </Paper>
      ) : null}

      {reportId ? <input hidden name='reportId' readOnly value={reportId} /> : null}
      <input hidden name='reportPayload' readOnly value={payload} />

      <Button
        disabled={!selectedStack}
        size='large'
        startIcon={<SaveRoundedIcon />}
        type='submit'
        variant='contained'
      >
        {submitLabel ?? t.saveReportLabel}
      </Button>
    </Stack>
  );
}

function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
