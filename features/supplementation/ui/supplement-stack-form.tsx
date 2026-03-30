'use client';

import { useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Button,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { formatSupplementToken } from '@/features/supplements/application/supplement-atlas-grid';
import type { Supplement } from '@/features/supplements/domain/supplement.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';
import { useUnsavedChangesWarning } from '@/shared/ui/use-unsaved-changes-warning';

import type {
  SupplementAmountUnit,
  SupplementStackContext,
  SupplementStackSummary,
} from '../domain/supplementation.types';
import { createSupplementStackAction } from '../infrastructure/supplementation.actions';

interface SupplementStackFormProps {
  formAction?: (formData: FormData) => void | Promise<void>;
  initialStack?: SupplementStackSummary | null;
  onCancel?: () => void;
  stackId?: string;
  supplements: Supplement[];
  submitLabel?: string;
  translations: TranslationDictionary;
}

interface SupplementStackItemDraft {
  id: string;
  supplementSlug: string;
  variantId: string;
  amount: string;
  unit: SupplementAmountUnit;
  notes: string;
}

const supplementAmountUnits: SupplementAmountUnit[] = [
  'mg',
  'g',
  'mcg',
  'ml',
  'capsule',
  'tablet',
  'scoop',
  'softgel',
];

const supplementStackContexts: SupplementStackContext[] = [
  'pre_workout',
  'intra_workout',
  'post_workout',
  'morning',
  'evening',
  'with_meal',
  'daily',
  'flexible',
  'custom',
];

/**
 * Mobile-first form for building reusable supplement stacks from atlas entries.
 * @param props - Component props for the supplement-stack form.
 * @param props.supplements - Shared supplement atlas entries available for stack composition.
 * @param props.translations - Full translation dictionary for localized labels.
 * @returns A React element rendering the supplement-stack builder.
 */
export function SupplementStackForm({
  formAction = createSupplementStackAction,
  initialStack = null,
  onCancel,
  stackId,
  supplements,
  submitLabel,
  translations,
}: SupplementStackFormProps) {
  const t = translations.supplementation;
  const { formRef, markSubmitted } = useUnsavedChangesWarning({
    message: translations.common.unsavedChangesWarning,
  });
  const [name, setName] = useState(initialStack?.name ?? '');
  const [context, setContext] = useState<SupplementStackContext>(
    initialStack?.context ?? 'pre_workout',
  );
  const [notes, setNotes] = useState(initialStack?.notes ?? '');
  const [isFavorite, setIsFavorite] = useState(initialStack?.isFavorite ?? true);
  const [items, setItems] = useState<SupplementStackItemDraft[]>(
    initialStack
      ? mapStackItemsToDrafts(initialStack, supplements)
      : [createStackItemDraft(supplements)],
  );
  function resetFormDraft() {
    setName(initialStack?.name ?? '');
    setContext(initialStack?.context ?? 'pre_workout');
    setNotes(initialStack?.notes ?? '');
    setIsFavorite(initialStack?.isFavorite ?? true);
    setItems(
      initialStack
        ? mapStackItemsToDrafts(initialStack, supplements)
        : [createStackItemDraft(supplements)],
    );
  }

  const payload = useMemo(
    () =>
      JSON.stringify({
        name,
        context,
        notes: notes.trim() || null,
        isFavorite,
        items: items.map((item, itemIndex) => {
          const supplement = supplements.find(
            (candidate) => candidate.slug === item.supplementSlug,
          );
          const variant =
            supplement?.variants.find((candidate) => candidate.id === item.variantId) ??
            supplement?.variants[0];

          return {
            order: itemIndex + 1,
            supplementId: supplement?.id ?? '',
            supplementSlug: supplement?.slug ?? '',
            supplementName: supplement?.name ?? '',
            variantId: variant?.id ?? null,
            variantSlug: variant?.slug ?? null,
            variantName: variant?.name ?? null,
            amount: Number(item.amount),
            unit: item.unit,
            notes: item.notes.trim() || null,
          };
        }),
      }),
    [context, isFavorite, items, name, notes, supplements],
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
            {t.addStackTitle}
          </Typography>
          <Typography color='text.secondary'>{t.addStackDescription}</Typography>
          <TextField
            label={t.stackNameLabel}
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
          <TextField
            label={t.stackContextLabel}
            onChange={(event) =>
              setContext(event.target.value as SupplementStackContext)}
            select
            value={context}
          >
            {supplementStackContexts.map((option) => (
              <MenuItem key={option} value={option}>
                {formatSupplementToken(option)}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography component='label' htmlFor='supplement-stack-favorite-switch' variant='body2'>
              {t.stackFavoriteLabel}
            </Typography>
            <Switch
              checked={isFavorite}
              id='supplement-stack-favorite-switch'
              onChange={(event) => setIsFavorite(event.target.checked)}
            />
          </Stack>
          <TextField
            label={t.stackNotesLabel}
            minRows={3}
            multiline
            onChange={(event) => setNotes(event.target.value)}
            value={notes}
          />
        </Stack>
      </Paper>

      <Stack spacing={2}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography component='h2' variant='h6'>
            {t.stackItemsTitle}
          </Typography>
          <Button
            onClick={() => setItems((current) => [...current, createStackItemDraft(supplements)])}
            startIcon={<AddRoundedIcon />}
            type='button'
            variant='outlined'
          >
            {t.addStackItemLabel}
          </Button>
        </Stack>

        {items.map((item, itemIndex) => {
          const supplement = supplements.find(
            (candidate) => candidate.slug === item.supplementSlug,
          );
          const variants = supplement?.variants ?? [];

          return (
            <Paper
              elevation={0}
              key={item.id}
              sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}
            >
              <Stack spacing={2}>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography variant='subtitle1'>
                    {`${t.stackItemsTitle} ${itemIndex + 1}`}
                  </Typography>
                  {items.length > 1 ? (
                    <Button
                      color='error'
                      onClick={() =>
                        setItems((current) =>
                          current.filter((candidate) => candidate.id !== item.id),
                        )}
                      startIcon={<DeleteOutlineRoundedIcon />}
                      type='button'
                      variant='text'
                    >
                      {t.removeStackItemLabel}
                    </Button>
                  ) : null}
                </Stack>
                <TextField
                  label={translations.supplements.columnSubstance}
                  onChange={(event) => {
                    const nextSlug = event.target.value;
                    const nextSupplement = supplements.find(
                      (candidate) => candidate.slug === nextSlug,
                    );
                    const nextVariant =
                      nextSupplement?.variants.find((variant) => variant.isDefault) ??
                      nextSupplement?.variants[0];

                    setItems((current) =>
                      current.map((candidate) =>
                        candidate.id === item.id
                          ? {
                              ...candidate,
                              supplementSlug: nextSlug,
                              variantId: nextVariant?.id ?? '',
                            }
                          : candidate,
                      ),
                    );
                  }}
                  required
                  select
                  value={item.supplementSlug}
                >
                  {supplements.map((option) => (
                    <MenuItem key={option.id} value={option.slug}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  disabled={!variants.length}
                  label={t.stackVariantLabel}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((candidate) =>
                        candidate.id === item.id
                          ? { ...candidate, variantId: event.target.value }
                          : candidate,
                      ),
                    )
                  }
                  select
                  value={item.variantId}
                >
                  {variants.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    fullWidth
                    inputProps={{ min: 0.01, step: 'any' }}
                    label={t.stackAmountLabel}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((candidate) =>
                          candidate.id === item.id
                            ? { ...candidate, amount: event.target.value }
                            : candidate,
                        ),
                      )
                    }
                    required
                    type='number'
                    value={item.amount}
                  />
                  <TextField
                    fullWidth
                    label={t.stackUnitLabel}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((candidate) =>
                          candidate.id === item.id
                            ? {
                                ...candidate,
                                unit: event.target.value as SupplementAmountUnit,
                              }
                            : candidate,
                        ),
                      )
                    }
                    select
                    value={item.unit}
                  >
                    {supplementAmountUnits.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <TextField
                  label={t.stackItemNotesLabel}
                  minRows={2}
                  multiline
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((candidate) =>
                        candidate.id === item.id
                          ? { ...candidate, notes: event.target.value }
                          : candidate,
                      ),
                    )
                  }
                  value={item.notes}
                />
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {stackId ? <input hidden name='stackId' readOnly value={stackId} /> : null}
      <input hidden name='stackPayload' readOnly value={payload} />

      <FormActionButtons
        clearLabel={translations.common.clearForm}
        discardLabel={onCancel ? translations.common.discardForm : undefined}
        onClear={resetFormDraft}
        onDiscard={onCancel}
        submitIcon={<SaveRoundedIcon />}
        submitLabel={submitLabel ?? t.saveStackLabel}
      />
    </Stack>
  );
}

function createStackItemDraft(supplements: Supplement[]): SupplementStackItemDraft {
  const supplement = supplements[0];
  const variant =
    supplement?.variants.find((candidate) => candidate.isDefault) ??
    supplement?.variants[0];

  return {
    id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
    supplementSlug: supplement?.slug ?? '',
    variantId: variant?.id ?? '',
    amount: '',
    unit: 'g',
    notes: '',
  };
}

function mapStackItemsToDrafts(
  stack: SupplementStackSummary,
  supplements: Supplement[],
): SupplementStackItemDraft[] {
  if (!stack.items.length) {
    return [createStackItemDraft(supplements)];
  }

  return stack.items.map((item) => {
    const supplement = supplements.find(
      (candidate) => candidate.slug === item.supplementSlug,
    );
    const variant =
      supplement?.variants.find((candidate) => candidate.id === item.variantId) ??
      supplement?.variants[0];

    return {
      id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      supplementSlug: item.supplementSlug,
      variantId: variant?.id ?? item.variantId ?? '',
      amount: String(item.amount),
      unit: item.unit,
      notes: item.notes ?? '',
    };
  });
}
