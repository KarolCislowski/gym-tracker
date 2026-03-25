'use client';

import { Paper, Stack, Typography } from '@mui/material';

import { convertBodyMassFromMetric } from '@/shared/units/application/unit-conversion';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

import type {
  BodyMetricsChartPoint,
  DashboardAnalytics,
  GoalComplianceChartPoint,
  WellbeingChartPoint,
  WorkoutVolumeChartPoint,
} from '../../application/dashboard-analytics';

interface DashboardAnalyticsMobileSummaryWidgetProps {
  analytics: DashboardAnalytics;
  translations: TranslationDictionary;
  unitSystem: UnitSystem;
}

export function DashboardAnalyticsMobileSummaryWidget({
  analytics,
  translations,
  unitSystem,
}: DashboardAnalyticsMobileSummaryWidgetProps) {
  const t = translations.dashboard;
  const latestGoalCompliance = analytics.goalCompliance.at(-1);
  const latestWellbeing = analytics.wellbeing.at(-1);
  const previousWellbeing = analytics.wellbeing.at(-2);
  const latestBodyMetrics = analytics.bodyMetrics.at(-1);
  const previousBodyMetrics = analytics.bodyMetrics.at(-2);
  const latestWorkoutVolume = analytics.workoutVolume.at(-1);
  const previousWorkoutVolume = analytics.workoutVolume.at(-2);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography variant='overline' color='text.secondary'>
            {t.quickStatusTitle}
          </Typography>
          <Typography color='text.secondary' variant='body2'>
            {t.analysisDesktopOnly}
          </Typography>
        </Stack>

        <Stack spacing={1.5}>
          <SummaryRow
            label={t.goalComplianceChart}
            value={formatGoalCompliance(latestGoalCompliance, t.noChartData)}
          />
          <SummaryRow
            label={t.wellbeingChart}
            value={formatNumericDelta(
              computeWellbeingAverage(latestWellbeing),
              computeWellbeingAverage(previousWellbeing),
              '',
              t.versusPreviousLabel,
              t.noChartData,
            )}
          />
          <SummaryRow
            label={t.bodyMetricsChart}
            value={formatBodyWeightDelta(
              latestBodyMetrics,
              previousBodyMetrics,
              unitSystem,
              t.versusPreviousLabel,
              t.noChartData,
            )}
          />
          <SummaryRow
            label={t.workoutVolumeChart}
            value={formatNumericDelta(
              computeWorkoutVolumeTotal(latestWorkoutVolume),
              computeWorkoutVolumeTotal(previousWorkoutVolume),
              ` ${t.chartSets.toLowerCase()}`,
              t.versusPreviousLabel,
              t.noChartData,
            )}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack
      alignItems='baseline'
      direction='row'
      justifyContent='space-between'
      spacing={2}
    >
      <Typography variant='body2'>{label}</Typography>
      <Typography fontWeight={600} textAlign='right' variant='body2'>
        {value}
      </Typography>
    </Stack>
  );
}

function formatGoalCompliance(
  point: GoalComplianceChartPoint | undefined,
  emptyLabel: string,
): string {
  if (!point) {
    return emptyLabel;
  }

  const totalMet = [point.sleep, point.steps, point.water, point.protein, point.cardio]
    .filter((value) => value === 1).length;

  return `${totalMet}/5`;
}

function computeWellbeingAverage(
  point: WellbeingChartPoint | undefined,
): number | null {
  if (!point) {
    return null;
  }

  const values = [point.mood, point.energy, point.stress, point.recovery].filter(
    (value): value is number => value != null,
  );

  if (!values.length) {
    return null;
  }

  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function computeWorkoutVolumeTotal(
  point: WorkoutVolumeChartPoint | undefined,
): number | null {
  if (!point) {
    return null;
  }

  const total = Object.entries(point).reduce((sum, [key, value]) => {
    if (key === 'label' || typeof value !== 'number') {
      return sum;
    }

    return sum + value;
  }, 0);

  return total;
}

function formatNumericDelta(
  current: number | null,
  previous: number | null,
  unitSuffix: string,
  versusPreviousLabel: string,
  emptyLabel: string,
): string {
  if (current == null) {
    return emptyLabel;
  }

  if (previous == null) {
    return `${current >= 0 ? '+' : ''}${current}${unitSuffix}`.trim();
  }

  const delta = Number((current - previous).toFixed(1));
  const formattedDelta = delta === 0 ? '0' : `${delta > 0 ? '+' : ''}${delta}`;

  return `${formattedDelta}${unitSuffix} ${versusPreviousLabel}`.trim();
}

function formatBodyWeightDelta(
  current: BodyMetricsChartPoint | undefined,
  previous: BodyMetricsChartPoint | undefined,
  unitSystem: UnitSystem,
  versusPreviousLabel: string,
  emptyLabel: string,
): string {
  if (current?.bodyWeightKg == null) {
    return emptyLabel;
  }

  const currentWeight = convertBodyMassFromMetric(current.bodyWeightKg, unitSystem);

  if (previous?.bodyWeightKg == null) {
    return formatBodyWeightValue(current.bodyWeightKg, unitSystem);
  }

  if (unitSystem === 'imperial_uk') {
    const currentValue = convertUkBodyWeightToStoneDecimal(current.bodyWeightKg);
    const previousValue = convertUkBodyWeightToStoneDecimal(previous.bodyWeightKg);
    const delta = Number((currentValue - previousValue).toFixed(1));

    return `${delta > 0 ? '+' : ''}${delta} st ${versusPreviousLabel}`;
  }

  if ('value' in currentWeight) {
    const previousWeight = convertBodyMassFromMetric(previous.bodyWeightKg, unitSystem);

    if ('value' in previousWeight) {
      const delta = Number((currentWeight.value - previousWeight.value).toFixed(1));

      return `${delta > 0 ? '+' : ''}${delta} ${currentWeight.unit} ${versusPreviousLabel}`;
    }
  }

  return emptyLabel;
}

function formatBodyWeightValue(kilograms: number, unitSystem: UnitSystem): string {
  const converted = convertBodyMassFromMetric(kilograms, unitSystem);

  if ('stones' in converted) {
    return `${converted.stones} st ${converted.pounds} lb`;
  }

  return `${converted.value} ${converted.unit}`;
}

function convertUkBodyWeightToStoneDecimal(kilograms: number): number {
  const converted = convertBodyMassFromMetric(kilograms, 'imperial_uk');

  if ('stones' in converted) {
    return Number((converted.stones + converted.pounds / 14).toFixed(1));
  }

  return 0;
}
