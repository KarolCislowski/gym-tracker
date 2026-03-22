import { Box, Paper, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Exercise } from '../domain/exercise.types';
import { formatAtlasToken } from '../application/exercise-atlas-grid';

import { ExerciseDetailChips } from './exercise-detail-chips';
import { ExerciseMuscleEngagementSection } from './exercise-muscle-engagement-section';

interface ExerciseDetailsOverviewSectionProps {
  exercise: Exercise;
  translations: TranslationDictionary['exercises'];
}

/**
 * Overview section for the exercise details page.
 * @param props - Component props for the overview section.
 * @param props.exercise - Exercise currently displayed on the details page.
 * @param props.translations - Localized exercise translations.
 * @returns A React element rendering description and summary chips.
 */
export function ExerciseDetailsOverviewSection({
  exercise,
  translations,
}: ExerciseDetailsOverviewSectionProps) {
  const supportedEquipment = uniqueFormattedTokens(
    exercise.variants.flatMap((variant) => variant.equipment),
  );
  const availableMetrics = uniqueFormattedTokens(
    exercise.variants.flatMap((variant) => variant.trackableMetrics),
  );
  const defaultVariantName =
    exercise.variants.find((variant) => variant.isDefault)?.name ?? '—';

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 6 }}
    >
      <Stack spacing={2}>
        <Typography component='h2' variant='h6'>
          {translations.sectionOverview}
        </Typography>
        {exercise.description ? (
          <Typography color='text.secondary'>{exercise.description}</Typography>
        ) : null}
        <Box
          component='section'
          aria-labelledby='exercise-overview-summary'
          sx={{ display: 'grid', gap: 2 }}
        >
          <Typography id='exercise-overview-summary' variant='subtitle1'>
            {translations.overviewSummaryLabel}
          </Typography>
          <Box
            component='dl'
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
              m: 0,
            }}
          >
            <SummaryItem label={translations.columnType} value={formatAtlasToken(exercise.type)} />
            <SummaryItem
              label={translations.columnPattern}
              value={formatAtlasToken(exercise.movementPattern)}
            />
            <SummaryItem
              label={translations.columnDifficulty}
              value={formatAtlasToken(exercise.difficulty)}
            />
            <SummaryItem
              label={translations.variantCountLabel}
              value={String(exercise.variants.length)}
            />
            <SummaryItem
              label={translations.defaultVariantNameLabel}
              value={defaultVariantName}
            />
          </Box>
        </Box>
        <ExerciseDetailChips
          label={translations.aliasesLabel}
          values={exercise.aliases}
        />
        <ExerciseMuscleEngagementSection
          muscles={exercise.muscles}
          translations={translations}
        />
        <ExerciseDetailChips
          label={translations.goalsLabel}
          values={exercise.goals?.map(formatAtlasToken)}
        />
        <ExerciseDetailChips
          label={translations.tagsLabel}
          values={exercise.tags?.map(formatAtlasToken)}
        />
        <ExerciseDetailChips
          label={translations.supportedEquipmentLabel}
          values={supportedEquipment}
        />
        <ExerciseDetailChips
          label={translations.availableMetricsLabel}
          values={availableMetrics}
        />
      </Stack>
    </Paper>
  );
}

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, auto) minmax(0, 1fr)',
        columnGap: 1,
        rowGap: 0.5,
        minWidth: 0,
        alignItems: 'baseline',
      }}
    >
      <Typography
        component='dt'
        variant='subtitle2'
        color='text.secondary'
        sx={{ m: 0, whiteSpace: 'nowrap' }}
      >
        {label}:
      </Typography>
      <Typography
        component='dd'
        variant='body1'
        sx={{ m: 0, minWidth: 0, overflowWrap: 'anywhere' }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function uniqueFormattedTokens(values: string[]) {
  return Array.from(new Set(values.map(formatAtlasToken)));
}
