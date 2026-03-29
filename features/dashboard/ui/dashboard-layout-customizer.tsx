'use client';

import { useMemo, useState } from 'react';

import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { ResolvedDashboardLayoutItem } from '../domain/dashboard-layout.types';
import {
  resetDashboardLayoutAction,
  saveDashboardLayoutAction,
} from '../infrastructure/dashboard-layout.actions';

interface DashboardLayoutCustomizerProps {
  items: ResolvedDashboardLayoutItem[];
  translations: TranslationDictionary['dashboard'];
}

/**
 * Client-side dashboard layout customization entry point.
 * @param props - Component props for the layout customizer.
 * @param props.items - Current resolved dashboard layout items.
 * @param props.translations - Localized dashboard translation subset.
 * @returns A React element rendering the customize button and modal editor.
 */
export function DashboardLayoutCustomizer({
  items,
  translations,
}: DashboardLayoutCustomizerProps) {
  const [open, setOpen] = useState(false);
  const [draftItems, setDraftItems] = useState(items);

  const serializedItems = useMemo(
    () =>
      JSON.stringify(
        draftItems.map((item, index) => ({
          widgetId: item.widgetId,
          visible: item.visible,
          order: index,
          sizePreset: item.sizePreset,
          tone: item.tone,
        })),
      ),
    [draftItems],
  );

  return (
    <>
      <Stack alignItems='flex-end'>
        <Button
          onClick={() => {
            setDraftItems(items);
            setOpen(true);
          }}
          startIcon={<TuneRoundedIcon />}
          variant='outlined'
        >
          {translations.customizeDashboardLabel}
        </Button>
      </Stack>

      <Dialog
        fullWidth
        maxWidth='md'
        onClose={() => setOpen(false)}
        open={open}
      >
        <DialogTitle>{translations.customizeDashboardTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5}>
            <Typography color='text.secondary'>
              {translations.customizeDashboardDescription}
            </Typography>

            {draftItems.map((item, index) => (
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                key={item.widgetId}
                spacing={2}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  alignItems: { md: 'center' },
                }}
              >
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Typography variant='subtitle2'>
                    {getDashboardWidgetLabel(item.widgetId, translations)}
                  </Typography>
                  {item.pinned ? (
                    <Typography color='text.secondary' variant='caption'>
                      {translations.lockedWidgetLabel}
                    </Typography>
                  ) : null}
                </Stack>

                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={item.visible}
                      disabled={item.pinned}
                      onChange={(event) => {
                        setDraftItems((currentItems) =>
                          currentItems.map((currentItem) =>
                            currentItem.widgetId === item.widgetId
                              ? { ...currentItem, visible: event.target.checked }
                              : currentItem,
                          ),
                        );
                      }}
                    />
                  )}
                  label={translations.visibleLabel}
                />

                <FormControl size='small' sx={{ minWidth: 160 }}>
                  <Select
                    displayEmpty
                    onChange={(event) => {
                      setDraftItems((currentItems) =>
                        currentItems.map((currentItem) =>
                          currentItem.widgetId === item.widgetId
                            ? {
                                ...currentItem,
                                sizePreset: String(event.target.value) as typeof currentItem.sizePreset,
                              }
                            : currentItem,
                        ),
                      );
                    }}
                    value={item.sizePreset}
                  >
                    {item.allowedSizePresets.map((sizePreset) => (
                      <MenuItem key={sizePreset} value={sizePreset}>
                        {getSizePresetLabel(sizePreset, translations)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size='small' sx={{ minWidth: 160 }}>
                  <Select
                    displayEmpty
                    onChange={(event) => {
                      setDraftItems((currentItems) =>
                        currentItems.map((currentItem) =>
                          currentItem.widgetId === item.widgetId
                            ? {
                                ...currentItem,
                                tone: String(event.target.value) as typeof currentItem.tone,
                              }
                            : currentItem,
                        ),
                      );
                    }}
                    value={item.tone}
                  >
                    {item.allowedTones.map((tone) => (
                      <MenuItem key={tone} value={tone}>
                        {getToneLabel(tone, translations)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack direction='row' spacing={0.5}>
                  <IconButton
                    aria-label={translations.moveUpLabel}
                    disabled={index === 0}
                    onClick={() => setDraftItems((currentItems) => moveItem(currentItems, index, -1))}
                    size='small'
                  >
                    <KeyboardArrowUpRoundedIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    aria-label={translations.moveDownLabel}
                    disabled={index === draftItems.length - 1}
                    onClick={() => setDraftItems((currentItems) => moveItem(currentItems, index, 1))}
                    size='small'
                  >
                    <KeyboardArrowDownRoundedIcon fontSize='small' />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <form action={resetDashboardLayoutAction}>
            <Button type='submit' variant='text'>
              {translations.resetDashboardLayoutLabel}
            </Button>
          </form>
          <Button onClick={() => setOpen(false)} variant='text'>
            {translations.cancelDashboardCustomization}
          </Button>
          <form action={saveDashboardLayoutAction}>
            <input name='items' type='hidden' value={serializedItems} />
            <Button type='submit' variant='contained'>
              {translations.saveDashboardLayoutLabel}
            </Button>
          </form>
        </DialogActions>
      </Dialog>
    </>
  );
}

function moveItem(
  items: ResolvedDashboardLayoutItem[],
  index: number,
  offset: -1 | 1,
) {
  const nextIndex = index + offset;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(index, 1);
  nextItems.splice(nextIndex, 0, movedItem);

  return nextItems;
}

function getDashboardWidgetLabel(
  widgetId: ResolvedDashboardLayoutItem['widgetId'],
  t: TranslationDictionary['dashboard'],
) {
  switch (widgetId) {
    case 'overview':
      return t.overview;
    case 'next_action':
      return t.nextActionTitle;
    case 'profile':
      return t.profile;
    case 'healthy_habits':
      return t.healthyHabits;
    case 'favorite_exercises':
      return t.favoriteExercises;
    case 'settings':
      return t.settings;
    case 'analytics':
      return t.analyticsTitle;
  }
}

function getSizePresetLabel(
  sizePreset: ResolvedDashboardLayoutItem['sizePreset'],
  t: TranslationDictionary['dashboard'],
) {
  switch (sizePreset) {
    case 'compact':
      return t.compactSizeLabel;
    case 'regular':
      return t.regularSizeLabel;
    case 'wide':
      return t.wideSizeLabel;
    case 'tall':
      return t.tallSizeLabel;
    case 'hero':
      return t.heroSizeLabel;
    case 'summary':
      return t.summarySizeLabel;
  }
}

function getToneLabel(
  tone: ResolvedDashboardLayoutItem['tone'],
  t: TranslationDictionary['dashboard'],
) {
  switch (tone) {
    case 'accent':
      return t.accentToneLabel;
    case 'glass':
      return t.glassToneLabel;
    case 'soft':
      return t.softToneLabel;
    case 'neutral':
      return t.neutralToneLabel;
  }
}
