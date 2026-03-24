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
  TextField,
  Typography,
} from '@mui/material';

import { formatAtlasToken } from '@/features/exercises/application/exercise-atlas-grid';
import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { createWorkoutTemplateAction } from '../infrastructure/workout.actions';

interface WorkoutTemplateFormProps {
  exercises: Exercise[];
  translations: TranslationDictionary;
}

type WorkoutBlockType = 'single' | 'superset' | 'circuit' | 'dropset';

interface WorkoutTemplateEntryDraft {
  id: string;
  exerciseSlug: string;
  variantId: string;
  selectedGrip: string;
  selectedStance: string;
  selectedAttachment: string;
  notes: string;
  restAfterEntrySec: string;
}

interface WorkoutTemplateBlockDraft {
  id: string;
  type: WorkoutBlockType;
  name: string;
  rounds: string;
  restAfterBlockSec: string;
  entries: WorkoutTemplateEntryDraft[];
}

/**
 * Mobile-first builder for reusable workout templates without performed sets.
 * @param props - Component props for the workout-template form.
 * @param props.exercises - Atlas exercises available for selection.
 * @param props.translations - Full translation dictionary for localized labels.
 * @returns A React element rendering the workout-template builder.
 */
export function WorkoutTemplateForm({
  exercises,
  translations,
}: WorkoutTemplateFormProps) {
  const t = translations.workouts;
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [blocks, setBlocks] = useState<WorkoutTemplateBlockDraft[]>([
    createTemplateBlockDraft(exercises),
  ]);

  const payload = useMemo(
    () =>
      JSON.stringify({
        name,
        notes: notes.trim() || null,
        blocks: blocks.map((block, blockIndex) => ({
          order: blockIndex + 1,
          type: block.type,
          name: block.name.trim() || null,
          rounds: normalizeOptionalInteger(block.rounds),
          restAfterBlockSec: normalizeOptionalInteger(block.restAfterBlockSec),
          entries: block.entries.map((entry, entryIndex) => {
            const exercise = exercises.find(
              (candidate) => candidate.slug === entry.exerciseSlug,
            );
            const variant =
              exercise?.variants.find((candidate) => candidate.id === entry.variantId) ??
              exercise?.variants[0];

            return {
              order: entryIndex + 1,
              exerciseId: exercise?.id ?? '',
              exerciseSlug: exercise?.slug ?? '',
              variantId: variant?.id ?? null,
              selectedGrip: entry.selectedGrip || null,
              selectedStance: entry.selectedStance || null,
              selectedAttachment: entry.selectedAttachment || null,
              notes: entry.notes.trim() || null,
              restAfterEntrySec: normalizeOptionalInteger(entry.restAfterEntrySec),
            };
          }),
        })),
      }),
    [blocks, exercises, name, notes],
  );

  return (
    <Stack component='form' action={createWorkoutTemplateAction} spacing={2.5}>
      <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={2}>
          <Typography component='h2' variant='h6'>
            {t.addTemplateTitle}
          </Typography>
          <Typography color='text.secondary'>{t.addTemplateDescription}</Typography>
          <TextField
            label={t.templateNameLabel}
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
          <TextField
            label={t.templateNotesLabel}
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
            {t.blocksLabel}
          </Typography>
          <Button
            type='button'
            onClick={() =>
              setBlocks((current) => [...current, createTemplateBlockDraft(exercises)])
            }
            startIcon={<AddRoundedIcon />}
            variant='outlined'
          >
            {t.addBlock}
          </Button>
        </Stack>

        {blocks.map((block, blockIndex) => (
          <Paper
            elevation={0}
            key={block.id}
            sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}
          >
            <Stack spacing={2}>
              <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Typography variant='subtitle1'>{`${t.blockTypeLabel} ${blockIndex + 1}`}</Typography>
                {blocks.length > 1 ? (
                  <Button
                    aria-label={`${t.removeBlock} ${blockIndex + 1}`}
                    color='error'
                    type='button'
                    onClick={() =>
                      setBlocks((current) =>
                        current.filter((candidate) => candidate.id !== block.id),
                      )
                    }
                    startIcon={<DeleteOutlineRoundedIcon />}
                    variant='text'
                  >
                    {t.removeBlock}
                  </Button>
                ) : null}
              </Stack>
              <TextField
                label={t.blockTypeLabel}
                onChange={(event) =>
                  updateBlock(block.id, { type: event.target.value as WorkoutBlockType })
                }
                select
                value={block.type}
              >
                <MenuItem value='single'>{t.blockTypeSingle}</MenuItem>
                <MenuItem value='superset'>{t.blockTypeSuperset}</MenuItem>
                <MenuItem value='circuit'>{t.blockTypeCircuit}</MenuItem>
                <MenuItem value='dropset'>{t.blockTypeDropset}</MenuItem>
              </TextField>
              <TextField
                label={t.blockNameLabel}
                onChange={(event) => updateBlock(block.id, { name: event.target.value })}
                value={block.name}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {(block.type === 'circuit' || block.type === 'superset') ? (
                  <TextField
                    fullWidth
                    label={t.roundsLabel}
                    onChange={(event) => updateBlock(block.id, { rounds: event.target.value })}
                    type='number'
                    value={block.rounds}
                  />
                ) : null}
                <TextField
                  fullWidth
                  label={t.restAfterBlockLabel}
                  onChange={(event) =>
                    updateBlock(block.id, { restAfterBlockSec: event.target.value })
                  }
                  type='number'
                  value={block.restAfterBlockSec}
                />
              </Stack>

              {block.entries.map((entry, entryIndex) => {
                const exercise = exercises.find((candidate) => candidate.slug === entry.exerciseSlug);
                const variant =
                  exercise?.variants.find((candidate) => candidate.id === entry.variantId) ??
                  exercise?.variants[0];

                return (
                  <Paper
                    elevation={0}
                    key={entry.id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 4,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle2'>{`${t.exerciseLabel} ${entryIndex + 1}`}</Typography>
                        {block.entries.length > 1 ? (
                          <Button
                            aria-label={`${t.removeEntry} ${entryIndex + 1}, ${t.blockTypeLabel} ${blockIndex + 1}`}
                            color='error'
                            type='button'
                            onClick={() => removeEntry(block.id, entry.id)}
                            startIcon={<DeleteOutlineRoundedIcon />}
                            variant='text'
                          >
                            {t.removeEntry}
                          </Button>
                        ) : null}
                      </Stack>
                      <TextField
                        label={t.exerciseLabel}
                        onChange={(event) =>
                          replaceEntryExercise(block.id, entry.id, event.target.value)
                        }
                        select
                        value={entry.exerciseSlug}
                      >
                        {exercises.map((option) => (
                          <MenuItem key={option.id} value={option.slug}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label={t.variantLabel}
                        onChange={(event) =>
                          updateEntry(block.id, entry.id, { variantId: event.target.value })
                        }
                        select
                        value={entry.variantId}
                      >
                        {(exercise?.variants ?? []).map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        {variant?.gripOptions?.length ? (
                          <TextField
                            fullWidth
                            label={t.gripLabel}
                            onChange={(event) =>
                              updateEntry(block.id, entry.id, { selectedGrip: event.target.value })
                            }
                            select
                            value={entry.selectedGrip}
                          >
                            <MenuItem value=''>—</MenuItem>
                            {variant.gripOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {formatAtlasToken(option)}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : null}
                        {variant?.stanceOptions?.length ? (
                          <TextField
                            fullWidth
                            label={t.stanceLabel}
                            onChange={(event) =>
                              updateEntry(block.id, entry.id, { selectedStance: event.target.value })
                            }
                            select
                            value={entry.selectedStance}
                          >
                            <MenuItem value=''>—</MenuItem>
                            {variant.stanceOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {formatAtlasToken(option)}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : null}
                        {variant?.attachmentOptions?.length ? (
                          <TextField
                            fullWidth
                            label={t.attachmentLabel}
                            onChange={(event) =>
                              updateEntry(block.id, entry.id, {
                                selectedAttachment: event.target.value,
                              })
                            }
                            select
                            value={entry.selectedAttachment}
                          >
                            <MenuItem value=''>—</MenuItem>
                            {variant.attachmentOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {formatAtlasToken(option)}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : null}
                      </Stack>
                      <TextField
                        label={t.restAfterEntryLabel}
                        onChange={(event) =>
                          updateEntry(block.id, entry.id, {
                            restAfterEntrySec: event.target.value,
                          })
                        }
                        type='number'
                        value={entry.restAfterEntrySec}
                      />
                      <TextField
                        label={t.entryNotesLabel}
                        minRows={2}
                        multiline
                        onChange={(event) =>
                          updateEntry(block.id, entry.id, { notes: event.target.value })
                        }
                        value={entry.notes}
                      />
                    </Stack>
                  </Paper>
                );
              })}

              {block.type !== 'single' ? (
                <Button
                  aria-label={`${t.addEntry}, ${t.blockTypeLabel} ${blockIndex + 1}`}
                  type='button'
                  onClick={() => addEntry(block.id)}
                  startIcon={<AddRoundedIcon />}
                  variant='outlined'
                >
                  {t.addEntry}
                </Button>
              ) : null}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <input name='templatePayload' type='hidden' value={payload} />

      <Button fullWidth size='large' startIcon={<SaveRoundedIcon />} type='submit' variant='contained'>
        {t.saveTemplate}
      </Button>
    </Stack>
  );

  function updateBlock(blockId: string, changes: Partial<WorkoutTemplateBlockDraft>) {
    setBlocks((current) =>
      current.map((block) => (block.id === blockId ? { ...block, ...changes } : block)),
    );
  }

  function addEntry(blockId: string) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? { ...block, entries: [...block.entries, createTemplateEntryDraft(exercises)] }
          : block,
      ),
    );
  }

  function removeEntry(blockId: string, entryId: string) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? { ...block, entries: block.entries.filter((entry) => entry.id !== entryId) }
          : block,
      ),
    );
  }

  function replaceEntryExercise(blockId: string, entryId: string, exerciseSlug: string) {
    const exercise = exercises.find((candidate) => candidate.slug === exerciseSlug) ?? exercises[0];
    const nextVariant = exercise?.variants[0];

    updateEntry(blockId, entryId, {
      exerciseSlug: exercise?.slug ?? '',
      variantId: nextVariant?.id ?? '',
      selectedGrip: '',
      selectedStance: '',
      selectedAttachment: '',
    });
  }

  function updateEntry(
    blockId: string,
    entryId: string,
    changes: Partial<WorkoutTemplateEntryDraft>,
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              entries: block.entries.map((entry) =>
                entry.id === entryId ? { ...entry, ...changes } : entry,
              ),
            }
          : block,
      ),
    );
  }
}

function createTemplateBlockDraft(exercises: Exercise[]): WorkoutTemplateBlockDraft {
  return {
    id: crypto.randomUUID(),
    type: 'single',
    name: '',
    rounds: '',
    restAfterBlockSec: '',
    entries: [createTemplateEntryDraft(exercises)],
  };
}

function createTemplateEntryDraft(exercises: Exercise[]): WorkoutTemplateEntryDraft {
  const exercise = exercises[0];
  const variant = exercise?.variants[0];

  return {
    id: crypto.randomUUID(),
    exerciseSlug: exercise?.slug ?? '',
    variantId: variant?.id ?? '',
    selectedGrip: '',
    selectedStance: '',
    selectedAttachment: '',
    notes: '',
    restAfterEntrySec: '',
  };
}

function normalizeOptionalInteger(value: string): number | null {
  const normalized = value.trim();
  return normalized ? Number.parseInt(normalized, 10) : null;
}
