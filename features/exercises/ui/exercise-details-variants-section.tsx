import {
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

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Exercise } from '../domain/exercise.types';
import { formatAtlasToken } from '../application/exercise-atlas-grid';

interface ExerciseDetailsVariantsSectionProps {
  exercise: Exercise;
  translations: TranslationDictionary['exercises'];
}

/**
 * Variant comparison section for the exercise details page.
 * @param props - Component props for the variants section.
 * @param props.exercise - Exercise whose variants are compared.
 * @param props.translations - Localized exercise translations.
 * @returns A React element rendering a variants comparison table and execution notes.
 */
export function ExerciseDetailsVariantsSection({
  exercise,
  translations,
}: ExerciseDetailsVariantsSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 6 }}
    >
      <Stack spacing={2}>
        <Typography component='h2' variant='h6'>
          {translations.sectionVariants}
        </Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size='small' aria-label={translations.sectionVariants}>
            <TableHead>
              <TableRow>
                <TableCell>{translations.columnExercise}</TableCell>
                <TableCell>{translations.columnEquipment}</TableCell>
                <TableCell>{translations.gripOptionsLabel}</TableCell>
                <TableCell>{translations.stanceOptionsLabel}</TableCell>
                <TableCell>{translations.attachmentOptionsLabel}</TableCell>
                <TableCell>{translations.bodyPositionLabel}</TableCell>
                <TableCell>{translations.limbModeLabel}</TableCell>
                <TableCell>{translations.trackableMetricsLabel}</TableCell>
                <TableCell>{translations.defaultVariantLabel}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exercise.variants.map((variant) => (
                <TableRow key={variant.id} hover>
                  <TableCell component='th' scope='row'>
                    {variant.name}
                  </TableCell>
                  <TableCell>{joinTokens(variant.equipment)}</TableCell>
                  <TableCell>{joinTokens(variant.gripOptions)}</TableCell>
                  <TableCell>{joinTokens(variant.stanceOptions)}</TableCell>
                  <TableCell>{joinTokens(variant.attachmentOptions)}</TableCell>
                  <TableCell>
                    {variant.bodyPosition
                      ? formatAtlasToken(variant.bodyPosition)
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {variant.limbMode ? formatAtlasToken(variant.limbMode) : '—'}
                  </TableCell>
                  <TableCell>{joinTokens(variant.trackableMetrics)}</TableCell>
                  <TableCell>
                    {variant.isDefault ? translations.yesLabel : translations.noLabel}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {exercise.variants.some((variant) => variant.executionNotes?.length) ? (
          <Stack spacing={1}>
            <Typography variant='subtitle2'>
              {translations.executionNotesLabel}
            </Typography>
            {exercise.variants.map((variant) =>
              variant.executionNotes?.length ? (
                <Stack key={`${variant.id}-notes`} spacing={0.5}>
                  <Typography fontWeight={600}>{variant.name}</Typography>
                  <Stack component='ul' spacing={0.5} sx={{ pl: 3, m: 0 }}>
                    {variant.executionNotes.map((note) => (
                      <Typography component='li' key={note} color='text.secondary'>
                        {note}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              ) : null,
            )}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );

  function joinTokens(values?: string[]): string {
    return values?.length ? values.map(formatAtlasToken).join(', ') : '—';
  }
}
