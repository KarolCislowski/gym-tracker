'use client';

import { useEffect, useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Alert,
  Button,
  ListSubheader,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import type { Exercise } from '@/features/exercises/domain/exercise.types';
import { formatAtlasToken } from '@/features/exercises/application/exercise-atlas-grid';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';
import { useUnsavedChangesWarning } from '@/shared/ui/use-unsaved-changes-warning';

import type {
  WorkoutSessionDetails,
  WorkoutSessionDuplicateDraft,
  WorkoutTemplateSummary,
} from '../domain/workout.types';
import { createWorkoutReportAction } from '../infrastructure/workout.actions';

interface WorkoutReportFormProps {
  exercises: Exercise[];
  favoriteExerciseSlugs: string[];
  formAction?: (formData: FormData) => Promise<void>;
  initialDuplicateDraft?: WorkoutSessionDuplicateDraft | null;
  initialReport?: WorkoutSessionDetails | null;
  initialTemplate?: WorkoutTemplateSummary | null;
  onCancel?: () => void;
  reportId?: string;
  submitLabel?: string;
  translations: TranslationDictionary;
}

type WorkoutBlockType = 'single' | 'superset' | 'circuit' | 'dropset';
type WorkoutSetKind = 'normal' | 'drop' | 'backoff' | 'top';

interface WorkoutSetDraft {
  id: string;
  reps: string;
  weight: string;
  durationSec: string;
  distanceMeters: string;
  calories: string;
  rpe: string;
  rir: string;
  isWarmup: boolean;
  isFailure: boolean;
  setKind: WorkoutSetKind;
  parentSetOrder: string;
}

interface WorkoutEntryDraft {
  id: string;
  exerciseSlug: string;
  variantId: string;
  selectedGrip: string;
  selectedStance: string;
  selectedAttachment: string;
  notes: string;
  restAfterEntrySec: string;
  sets: WorkoutSetDraft[];
}

interface WorkoutBlockDraft {
  id: string;
  type: WorkoutBlockType;
  name: string;
  rounds: string;
  restAfterBlockSec: string;
  entries: WorkoutEntryDraft[];
}

/**
 * Mobile-friendly builder form for creating structured workout reports.
 * @param props - Component props for the workout report form.
 * @param props.exercises - Atlas exercises available for selection.
 * @param props.translations - Full translation dictionary for localized labels.
 * @returns A React element rendering the workout report builder form.
 */
export function WorkoutReportForm({
  exercises,
  favoriteExerciseSlugs,
  formAction = createWorkoutReportAction,
  initialDuplicateDraft = null,
  initialReport = null,
  initialTemplate = null,
  onCancel,
  reportId,
  submitLabel,
  translations,
}: WorkoutReportFormProps) {
  const t = translations.workouts;
  const { formRef, markSubmitted } = useUnsavedChangesWarning({
    message: translations.common.unsavedChangesWarning,
  });
  const favoriteExercises = useMemo(
    () =>
      exercises.filter((exercise) =>
        favoriteExerciseSlugs.includes(exercise.slug),
      ),
    [exercises, favoriteExerciseSlugs],
  );
  const nonFavoriteExercises = useMemo(
    () =>
      exercises.filter(
        (exercise) => !favoriteExerciseSlugs.includes(exercise.slug),
      ),
    [exercises, favoriteExerciseSlugs],
  );
  const [workoutName, setWorkoutName] = useState(
    initialReport?.workoutName
      ?? initialDuplicateDraft?.workoutName
      ?? initialTemplate?.name
      ?? '',
  );
  const [performedAt, setPerformedAt] = useState(
    initialReport?.performedAt
      ? formatDateTimeLocal(new Date(initialReport.performedAt))
      : initialDuplicateDraft?.performedAt
        ? formatDateTimeLocal(new Date(initialDuplicateDraft.performedAt))
      : formatDateTimeLocal(new Date()),
  );
  const [startedAt, setStartedAt] = useState(
    initialReport?.startedAt
      ? formatDateTimeLocal(new Date(initialReport.startedAt))
      : initialDuplicateDraft?.startedAt
        ? formatDateTimeLocal(new Date(initialDuplicateDraft.startedAt))
      : '',
  );
  const [endedAt, setEndedAt] = useState(
    initialReport?.endedAt
      ? formatDateTimeLocal(new Date(initialReport.endedAt))
      : initialDuplicateDraft?.endedAt
        ? formatDateTimeLocal(new Date(initialDuplicateDraft.endedAt))
        : '',
  );
  const [notes, setNotes] = useState(
    initialReport?.notes
      ?? initialDuplicateDraft?.notes
      ?? initialTemplate?.notes
      ?? '',
  );
  const [blocks, setBlocks] = useState<WorkoutBlockDraft[]>(
    createBlocksFromSource(
      exercises,
      initialTemplate,
      initialReport,
      initialDuplicateDraft,
    ),
  );

  function resetFormDraft() {
    setWorkoutName(
      initialReport?.workoutName
        ?? initialDuplicateDraft?.workoutName
        ?? initialTemplate?.name
        ?? '',
    );
    setPerformedAt(
      initialReport?.performedAt
        ? formatDateTimeLocal(new Date(initialReport.performedAt))
        : initialDuplicateDraft?.performedAt
          ? formatDateTimeLocal(new Date(initialDuplicateDraft.performedAt))
          : formatDateTimeLocal(new Date()),
    );
    setStartedAt(
      initialReport?.startedAt
        ? formatDateTimeLocal(new Date(initialReport.startedAt))
        : initialDuplicateDraft?.startedAt
          ? formatDateTimeLocal(new Date(initialDuplicateDraft.startedAt))
          : '',
    );
    setEndedAt(
      initialReport?.endedAt
        ? formatDateTimeLocal(new Date(initialReport.endedAt))
        : initialDuplicateDraft?.endedAt
          ? formatDateTimeLocal(new Date(initialDuplicateDraft.endedAt))
          : '',
    );
    setNotes(
      initialReport?.notes
        ?? initialDuplicateDraft?.notes
        ?? initialTemplate?.notes
        ?? '',
    );
    setBlocks(
      createBlocksFromSource(
        exercises,
        initialTemplate,
        initialReport,
        initialDuplicateDraft,
      ),
    );
  }

  useEffect(() => {
    setWorkoutName(initialReport?.workoutName ?? initialTemplate?.name ?? '');
    setPerformedAt(
      initialReport?.performedAt
        ? formatDateTimeLocal(new Date(initialReport.performedAt))
        : initialDuplicateDraft?.performedAt
          ? formatDateTimeLocal(new Date(initialDuplicateDraft.performedAt))
        : formatDateTimeLocal(new Date()),
    );
    setStartedAt(
      initialReport?.startedAt
        ? formatDateTimeLocal(new Date(initialReport.startedAt))
        : initialDuplicateDraft?.startedAt
          ? formatDateTimeLocal(new Date(initialDuplicateDraft.startedAt))
        : '',
    );
    setEndedAt(
      initialReport?.endedAt
        ? formatDateTimeLocal(new Date(initialReport.endedAt))
        : initialDuplicateDraft?.endedAt
          ? formatDateTimeLocal(new Date(initialDuplicateDraft.endedAt))
          : '',
    );
    setWorkoutName(
      initialReport?.workoutName
        ?? initialDuplicateDraft?.workoutName
        ?? initialTemplate?.name
        ?? '',
    );
    setNotes(
      initialReport?.notes
        ?? initialDuplicateDraft?.notes
        ?? initialTemplate?.notes
        ?? '',
    );
    setBlocks(
      createBlocksFromSource(
        exercises,
        initialTemplate,
        initialReport,
        initialDuplicateDraft,
      ),
    );
  }, [exercises, initialDuplicateDraft, initialReport, initialTemplate]);

  const payload = useMemo(() => {
    return JSON.stringify({
      workoutName,
      performedAt: new Date(performedAt).toISOString(),
      startedAt: startedAt ? new Date(startedAt).toISOString() : null,
      endedAt: endedAt ? new Date(endedAt).toISOString() : null,
      durationMinutes: resolveDurationMinutes(startedAt, endedAt),
      notes: notes.trim() || null,
      weatherSnapshot: null,
      blocks: blocks.map((block, blockIndex) => ({
        order: blockIndex + 1,
        type: block.type,
        name: block.name.trim() || null,
        rounds: normalizeOptionalInteger(block.rounds),
        restAfterBlockSec: normalizeOptionalInteger(block.restAfterBlockSec),
        entries: block.entries.map((entry, entryIndex) => {
          const exercise = exercises.find((candidate) => candidate.slug === entry.exerciseSlug);
          const variant = exercise?.variants.find((candidate) => candidate.id === entry.variantId)
            ?? exercise?.variants[0];
          const trackableMetrics = variant?.trackableMetrics ?? [];

          return {
            order: entryIndex + 1,
            exerciseId: exercise?.id ?? '',
            exerciseSlug: exercise?.slug ?? '',
            variantId: variant?.id ?? null,
            trackableMetrics,
            selectedEquipment: variant?.equipment ?? [],
            selectedGrip: entry.selectedGrip || null,
            selectedStance: entry.selectedStance || null,
            selectedAttachment: entry.selectedAttachment || null,
            notes: entry.notes.trim() || null,
            restAfterEntrySec: normalizeOptionalInteger(entry.restAfterEntrySec),
            sets: entry.sets.map((setDraft, setIndex) => ({
              order: setIndex + 1,
              reps: trackableMetrics.includes('reps')
                ? normalizeOptionalInteger(setDraft.reps)
                : null,
              weight: trackableMetrics.includes('weight')
                ? normalizeOptionalNumber(setDraft.weight)
                : null,
              durationSec: trackableMetrics.includes('duration')
                ? normalizeOptionalInteger(setDraft.durationSec)
                : null,
              distanceMeters: trackableMetrics.includes('distance')
                ? normalizeOptionalNumber(setDraft.distanceMeters)
                : null,
              calories: trackableMetrics.includes('calories')
                ? normalizeOptionalNumber(setDraft.calories)
                : null,
              rpe: trackableMetrics.includes('rpe')
                ? normalizeOptionalNumber(setDraft.rpe)
                : null,
              rir: trackableMetrics.includes('rir')
                ? normalizeOptionalInteger(setDraft.rir)
                : null,
              isWarmup: setDraft.isWarmup,
              isFailure: setDraft.isFailure,
              setKind: setDraft.setKind,
              parentSetOrder: normalizeOptionalInteger(setDraft.parentSetOrder),
              completedAt: new Date(performedAt).toISOString(),
            })),
          };
        }),
      })),
    });
  }, [blocks, endedAt, exercises, notes, performedAt, startedAt, workoutName]);

  return (
    <Stack
      component='form'
      action={formAction}
      onSubmitCapture={markSubmitted}
      ref={formRef}
      spacing={2.5}
    >
      <Alert severity='info' variant='outlined'>
        {t.autoLocationHint}
      </Alert>

      <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', borderRadius: 6 }}>
        <Stack spacing={2}>
          <Typography component='h2' variant='h6'>
            {t.addReportTitle}
          </Typography>
          <Typography color='text.secondary'>{t.addReportDescription}</Typography>
          <TextField
            label={t.workoutNameLabel}
            onChange={(event) => setWorkoutName(event.target.value)}
            required
            value={workoutName}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              fullWidth
              label={t.performedAtLabel}
              onChange={(event) => setPerformedAt(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              type='datetime-local'
              value={performedAt}
            />
            <TextField
              fullWidth
              label={t.startedAtLabel}
              onChange={(event) => setStartedAt(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              type='datetime-local'
              value={startedAt}
            />
            <TextField
              fullWidth
              label={t.endedAtLabel}
              onChange={(event) => setEndedAt(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              type='datetime-local'
              value={endedAt}
            />
          </Stack>
          <TextField
            label={t.workoutNotesLabel}
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
            onClick={() => setBlocks((current) => [...current, createBlockDraft(exercises)])}
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
                      setBlocks((current) => current.filter((candidate) => candidate.id !== block.id))
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
                const variant = exercise?.variants.find((candidate) => candidate.id === entry.variantId)
                  ?? exercise?.variants[0];
                const trackableMetrics = variant?.trackableMetrics ?? [];

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
                        onChange={(event) => replaceEntryExercise(block.id, entry.id, event.target.value)}
                        select
                        value={entry.exerciseSlug}
                      >
                        {favoriteExercises.length ? (
                          <ListSubheader disableSticky>
                            {translations.dashboard.favoriteExercises}
                          </ListSubheader>
                        ) : null}
                        {favoriteExercises.map((option) => (
                          <MenuItem key={`favorite-${option.id}`} value={option.slug}>
                            {option.name}
                          </MenuItem>
                        ))}
                        {nonFavoriteExercises.length ? (
                          <ListSubheader disableSticky>
                            {t.exerciseLabel}
                          </ListSubheader>
                        ) : null}
                        {nonFavoriteExercises.map((option) => (
                          <MenuItem key={option.id} value={option.slug}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label={t.variantLabel}
                        onChange={(event) => updateEntry(block.id, entry.id, { variantId: event.target.value })}
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
                            onChange={(event) => updateEntry(block.id, entry.id, { selectedGrip: event.target.value })}
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
                            onChange={(event) => updateEntry(block.id, entry.id, { selectedStance: event.target.value })}
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
                              updateEntry(block.id, entry.id, { selectedAttachment: event.target.value })
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
                          updateEntry(block.id, entry.id, { restAfterEntrySec: event.target.value })
                        }
                        type='number'
                        value={entry.restAfterEntrySec}
                      />
                      <TextField
                        label={t.entryNotesLabel}
                        minRows={2}
                        multiline
                        onChange={(event) => updateEntry(block.id, entry.id, { notes: event.target.value })}
                        value={entry.notes}
                      />

                      {entry.sets.map((setDraft, setIndex) => (
                        <Paper
                          elevation={0}
                          key={setDraft.id}
                          sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 3 }}
                        >
                          <Stack spacing={1.25}>
                            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                              <Typography variant='subtitle2'>{`Set ${setIndex + 1}`}</Typography>
                              {entry.sets.length > 1 ? (
                                <Button
                                  aria-label={`${t.removeSet} ${setIndex + 1}, ${t.exerciseLabel} ${entryIndex + 1}, ${t.blockTypeLabel} ${blockIndex + 1}`}
                                  color='error'
                                  type='button'
                                  onClick={() => removeSet(block.id, entry.id, setDraft.id)}
                                  startIcon={<DeleteOutlineRoundedIcon />}
                                  variant='text'
                                >
                                  {t.removeSet}
                                </Button>
                              ) : null}
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                              <TextField
                                fullWidth
                                label={t.setKindLabel}
                                onChange={(event) =>
                                  updateSet(block.id, entry.id, setDraft.id, {
                                    setKind: event.target.value as WorkoutSetKind,
                                  })
                                }
                                select
                                value={setDraft.setKind}
                              >
                                <MenuItem value='normal'>{t.setKindNormal}</MenuItem>
                                <MenuItem value='drop'>{t.setKindDrop}</MenuItem>
                                <MenuItem value='backoff'>{t.setKindBackoff}</MenuItem>
                                <MenuItem value='top'>{t.setKindTop}</MenuItem>
                              </TextField>
                              {(setDraft.setKind === 'drop' || setDraft.setKind === 'backoff') && setIndex > 0 ? (
                                <TextField
                                  fullWidth
                                  label={t.parentSetLabel}
                                  onChange={(event) =>
                                    updateSet(block.id, entry.id, setDraft.id, {
                                      parentSetOrder: event.target.value,
                                    })
                                  }
                                  select
                                  value={setDraft.parentSetOrder}
                                >
                                  <MenuItem value=''>—</MenuItem>
                                  {entry.sets.slice(0, setIndex).map((_, previousIndex) => (
                                    <MenuItem key={previousIndex + 1} value={String(previousIndex + 1)}>
                                      {`Set ${previousIndex + 1}`}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              ) : null}
                            </Stack>
                            <MetricsFields
                              entrySet={setDraft}
                              onChange={(changes) => updateSet(block.id, entry.id, setDraft.id, changes)}
                              trackableMetrics={trackableMetrics}
                              translations={t}
                            />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                              <LabeledSwitch
                                checked={setDraft.isWarmup}
                                label={t.warmupLabel}
                                onChange={(checked) =>
                                  updateSet(block.id, entry.id, setDraft.id, { isWarmup: checked })
                                }
                              />
                              <LabeledSwitch
                                checked={setDraft.isFailure}
                                label={t.failureLabel}
                                onChange={(checked) =>
                                  updateSet(block.id, entry.id, setDraft.id, { isFailure: checked })
                                }
                              />
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}

                      <Button
                        aria-label={`${t.addSet}, ${t.exerciseLabel} ${entryIndex + 1}, ${t.blockTypeLabel} ${blockIndex + 1}`}
                        type='button'
                        onClick={() => addSet(block.id, entry.id)}
                        startIcon={<AddRoundedIcon />}
                        variant='outlined'
                      >
                        {t.addSet}
                      </Button>
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

      {reportId ? <input name='reportId' type='hidden' value={reportId} /> : null}
      <input name='reportPayload' type='hidden' value={payload} />

      <Paper
        elevation={8}
        sx={(theme) => ({
          position: 'sticky',
          bottom: 0,
          zIndex: theme.zIndex.appBar,
          p: 1.5,
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #111827, #0f172a)'
              : 'linear-gradient(180deg, #ffffff, #f8fafc)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 16px 34px rgba(2, 6, 23, 0.42)'
              : '0 14px 28px rgba(148, 163, 184, 0.14)',
        })}
      >
        <FormActionButtons
          clearLabel={translations.common.clearForm}
          discardLabel={onCancel ? translations.common.discardForm : undefined}
          onClear={resetFormDraft}
          onDiscard={onCancel}
          submitFullWidth
          submitIcon={<SaveRoundedIcon />}
          submitLabel={submitLabel ?? t.saveReport}
        />
      </Paper>
    </Stack>
  );

  function updateBlock(blockId: string, changes: Partial<WorkoutBlockDraft>) {
    setBlocks((current) =>
      current.map((block) => (block.id === blockId ? { ...block, ...changes } : block)),
    );
  }

  function addEntry(blockId: string) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? { ...block, entries: [...block.entries, createEntryDraft(exercises)] }
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
      sets: [createSetDraft()],
    });
  }

  function updateEntry(blockId: string, entryId: string, changes: Partial<WorkoutEntryDraft>) {
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

  function addSet(blockId: string, entryId: string) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              entries: block.entries.map((entry) =>
                entry.id === entryId
                  ? { ...entry, sets: [...entry.sets, createSetDraft()] }
                  : entry,
              ),
            }
          : block,
      ),
    );
  }

  function removeSet(blockId: string, entryId: string, setId: string) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              entries: block.entries.map((entry) =>
                entry.id === entryId
                  ? { ...entry, sets: entry.sets.filter((set) => set.id !== setId) }
                  : entry,
              ),
            }
          : block,
      ),
    );
  }

  function updateSet(
    blockId: string,
    entryId: string,
    setId: string,
    changes: Partial<WorkoutSetDraft>,
  ) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              entries: block.entries.map((entry) =>
                entry.id === entryId
                  ? {
                      ...entry,
                      sets: entry.sets.map((set) =>
                        set.id === setId ? { ...set, ...changes } : set,
                      ),
                    }
                  : entry,
              ),
            }
          : block,
      ),
    );
  }
}

function MetricsFields({
  entrySet,
  onChange,
  trackableMetrics,
  translations,
}: {
  entrySet: WorkoutSetDraft;
  onChange: (changes: Partial<WorkoutSetDraft>) => void;
  trackableMetrics: string[];
  translations: TranslationDictionary['workouts'];
}) {
  const fields = [
    trackableMetrics.includes('reps')
      ? { key: 'reps', label: translations.repsLabel, value: entrySet.reps }
      : null,
    trackableMetrics.includes('weight')
      ? { key: 'weight', label: translations.weightLabel, value: entrySet.weight }
      : null,
    trackableMetrics.includes('duration')
      ? { key: 'durationSec', label: translations.durationLabel, value: entrySet.durationSec }
      : null,
    trackableMetrics.includes('distance')
      ? { key: 'distanceMeters', label: translations.distanceLabel, value: entrySet.distanceMeters }
      : null,
    trackableMetrics.includes('calories')
      ? { key: 'calories', label: translations.caloriesLabel, value: entrySet.calories }
      : null,
    trackableMetrics.includes('rpe')
      ? { key: 'rpe', label: translations.rpeLabel, value: entrySet.rpe }
      : null,
    trackableMetrics.includes('rir')
      ? { key: 'rir', label: translations.rirLabel, value: entrySet.rir }
      : null,
  ].filter(Boolean) as Array<{ key: keyof WorkoutSetDraft; label: string; value: string }>;

  return (
    <Stack
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' },
        gap: 1,
      }}
    >
      {fields.map((field) => (
        <TextField
          key={field.key}
          label={field.label}
          onChange={(event) => onChange({ [field.key]: event.target.value } as Partial<WorkoutSetDraft>)}
          type='number'
          value={field.value}
        />
      ))}
    </Stack>
  );
}

function LabeledSwitch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Stack
      alignItems='center'
      direction='row'
      justifyContent='space-between'
      sx={{ px: 1.5, py: 0.5, border: 1, borderColor: 'divider', borderRadius: 3 }}
    >
      <Typography variant='body2'>{label}</Typography>
      <Switch checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </Stack>
  );
}

function createBlockDraft(exercises: Exercise[]): WorkoutBlockDraft {
  return {
    id: crypto.randomUUID(),
    type: 'single',
    name: '',
    rounds: '',
    restAfterBlockSec: '',
    entries: [createEntryDraft(exercises)],
  };
}

function createBlocksFromSource(
  exercises: Exercise[],
  template?: WorkoutTemplateSummary | null,
  report?: WorkoutSessionDetails | null,
  duplicateDraft?: WorkoutSessionDuplicateDraft | null,
): WorkoutBlockDraft[] {
  if (report?.blocks.length) {
    return report.blocks.map((block) => ({
      id: crypto.randomUUID(),
      type: block.type,
      name: block.name ?? '',
      rounds: block.rounds != null ? String(block.rounds) : '',
      restAfterBlockSec:
        block.restAfterBlockSec != null ? String(block.restAfterBlockSec) : '',
      entries: block.entries.map((entry) => ({
        id: crypto.randomUUID(),
        exerciseSlug: entry.exerciseSlug,
        variantId: entry.variantId ?? resolveVariantId(exercises, entry.exerciseSlug),
        selectedGrip: entry.selectedGrip ?? '',
        selectedStance: entry.selectedStance ?? '',
        selectedAttachment: entry.selectedAttachment ?? '',
        notes: entry.notes ?? '',
        restAfterEntrySec:
          entry.restAfterEntrySec != null ? String(entry.restAfterEntrySec) : '',
        sets: entry.sets.length
          ? entry.sets.map((set) => ({
              id: crypto.randomUUID(),
              reps: set.reps != null ? String(set.reps) : '',
              weight: set.weight != null ? String(set.weight) : '',
              durationSec: set.durationSec != null ? String(set.durationSec) : '',
              distanceMeters:
                set.distanceMeters != null ? String(set.distanceMeters) : '',
              calories: set.calories != null ? String(set.calories) : '',
              rpe: set.rpe != null ? String(set.rpe) : '',
              rir: set.rir != null ? String(set.rir) : '',
              isWarmup: set.isWarmup,
              isFailure: set.isFailure,
              setKind: set.setKind,
              parentSetOrder:
                set.parentSetOrder != null ? String(set.parentSetOrder) : '',
            }))
          : [createSetDraft()],
      })),
    }));
  }

  if (duplicateDraft?.blocks.length) {
    return duplicateDraft.blocks.map((block) => ({
      id: crypto.randomUUID(),
      type: block.type,
      name: block.name ?? '',
      rounds: block.rounds != null ? String(block.rounds) : '',
      restAfterBlockSec:
        block.restAfterBlockSec != null ? String(block.restAfterBlockSec) : '',
      entries: block.entries.map((entry) => ({
        id: crypto.randomUUID(),
        exerciseSlug: entry.exerciseSlug,
        variantId: entry.variantId ?? resolveVariantId(exercises, entry.exerciseSlug),
        selectedGrip: entry.selectedGrip ?? '',
        selectedStance: entry.selectedStance ?? '',
        selectedAttachment: entry.selectedAttachment ?? '',
        notes: entry.notes ?? '',
        restAfterEntrySec:
          entry.restAfterEntrySec != null ? String(entry.restAfterEntrySec) : '',
        sets: entry.sets.length
          ? entry.sets.map((set) => ({
              id: crypto.randomUUID(),
              reps: set.reps != null ? String(set.reps) : '',
              weight: set.weight != null ? String(set.weight) : '',
              durationSec: set.durationSec != null ? String(set.durationSec) : '',
              distanceMeters:
                set.distanceMeters != null ? String(set.distanceMeters) : '',
              calories: set.calories != null ? String(set.calories) : '',
              rpe: set.rpe != null ? String(set.rpe) : '',
              rir: set.rir != null ? String(set.rir) : '',
              isWarmup: set.isWarmup,
              isFailure: set.isFailure,
              setKind: set.setKind,
              parentSetOrder:
                set.parentSetOrder != null ? String(set.parentSetOrder) : '',
            }))
          : [createSetDraft()],
      })),
    }));
  }

  if (!template?.blocks.length) {
    return [createBlockDraft(exercises)];
  }

  return template.blocks.map((block) => ({
    id: crypto.randomUUID(),
    type: block.type,
    name: block.name ?? '',
    rounds: block.rounds != null ? String(block.rounds) : '',
    restAfterBlockSec:
      block.restAfterBlockSec != null ? String(block.restAfterBlockSec) : '',
    entries: block.entries.map((entry) => ({
      id: crypto.randomUUID(),
      exerciseSlug: entry.exerciseSlug,
      variantId: entry.variantId ?? resolveVariantId(exercises, entry.exerciseSlug),
      selectedGrip: entry.selectedGrip ?? '',
      selectedStance: entry.selectedStance ?? '',
      selectedAttachment: entry.selectedAttachment ?? '',
      notes: entry.notes ?? '',
      restAfterEntrySec:
        entry.restAfterEntrySec != null ? String(entry.restAfterEntrySec) : '',
      sets: [createSetDraft()],
    })),
  }));
}

function createEntryDraft(exercises: Exercise[]): WorkoutEntryDraft {
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
    sets: [createSetDraft()],
  };
}

function resolveVariantId(exercises: Exercise[], exerciseSlug: string): string {
  const exercise = exercises.find((candidate) => candidate.slug === exerciseSlug);
  return exercise?.variants[0]?.id ?? '';
}

function createSetDraft(): WorkoutSetDraft {
  return {
    id: crypto.randomUUID(),
    reps: '',
    weight: '',
    durationSec: '',
    distanceMeters: '',
    calories: '',
    rpe: '',
    rir: '',
    isWarmup: false,
    isFailure: false,
    setKind: 'normal',
    parentSetOrder: '',
  };
}

function formatDateTimeLocal(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function normalizeOptionalInteger(value: string): number | null {
  const normalized = value.trim();
  return normalized ? Number.parseInt(normalized, 10) : null;
}

function normalizeOptionalNumber(value: string): number | null {
  const normalized = value.trim();
  return normalized ? Number(normalized) : null;
}

function resolveDurationMinutes(startedAt: string, endedAt: string): number | null {
  if (!startedAt || !endedAt) {
    return null;
  }

  const start = new Date(startedAt);
  const end = new Date(endedAt);
  const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

  return diffMinutes > 0 ? diffMinutes : null;
}
