'use client';

import { useMemo, useState } from 'react';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
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

import type { SupplementStackSummary } from '../domain/supplementation.types';
import { createSupplementIntakeReportAction } from '../infrastructure/supplementation.actions';

interface SupplementIntakeFormProps {
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
  stacks,
  translations,
}: SupplementIntakeFormProps) {
  const t = translations.supplementation;
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
  const [stackId, setStackId] = useState(sortedStacks[0]?.id ?? '');
  const [takenAt, setTakenAt] = useState(formatDateTimeLocal(new Date()));
  const [notes, setNotes] = useState('');
  const selectedStack = sortedStacks.find((stack) => stack.id === stackId) ?? null;

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
    <Stack component='form' action={createSupplementIntakeReportAction} spacing={2.5}>
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
                    {stack.isFavorite ? `★ ${stack.name}` : stack.name}
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
              {selectedStack.isFavorite ? (
                <Chip
                  color='warning'
                  icon={<StarRoundedIcon />}
                  label={t.stackFavoriteLabel}
                  size='small'
                />
              ) : null}
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

      <input hidden name='reportPayload' readOnly value={payload} />

      <Button
        disabled={!selectedStack}
        size='large'
        startIcon={<SaveRoundedIcon />}
        type='submit'
        variant='contained'
      >
        {t.saveReportLabel}
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
