'use client';

import { Stack, Typography } from '@mui/material';

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
import {
  getLatestBodyWeightTrendPoints,
  getLatestWellbeingTrendPoints,
  getLatestWorkoutVolumeTrendPoints,
  resolveAnalyticsStateMessage,
  resolveBodyMetricsState,
  resolveGoalComplianceState,
  resolveWellbeingState,
  resolveWorkoutVolumeState,
} from '../../application/dashboard-analytics-state';
import { DashboardAnalyticsCard } from './dashboard-analytics-card';

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
  const goalComplianceState = resolveGoalComplianceState(analytics.goalCompliance);
  const wellbeingState = resolveWellbeingState(analytics.wellbeing);
  const bodyMetricsState = resolveBodyMetricsState(analytics.bodyMetrics);
  const workoutVolumeState = resolveWorkoutVolumeState(
    analytics.workoutVolume,
    analytics.workoutVolumeMuscleGroups,
  );
  const [latestWellbeing, previousWellbeing] = getLatestWellbeingTrendPoints(
    analytics.wellbeing,
  );
  const [latestBodyMetrics, previousBodyMetrics] = getLatestBodyWeightTrendPoints(
    analytics.bodyMetrics,
  );
  const [latestWorkoutVolume, previousWorkoutVolume] =
    getLatestWorkoutVolumeTrendPoints(analytics.workoutVolume);
  const allStates = [
    goalComplianceState,
    wellbeingState,
    bodyMetricsState,
    workoutVolumeState,
  ];
  const overallMessage = allStates.every((state) => state === 'start')
    ? t.startFirstEntry
    : allStates.every((state) => state !== 'ready')
      ? t.notEnoughDataForTrend
      : t.analysisDesktopOnly;

  return (
    <DashboardAnalyticsCard>
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Typography
            color='text.secondary'
            sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
            variant='overline'
          >
            {t.quickStatusTitle}
          </Typography>
          <Typography color='text.secondary' variant='body2'>
            {overallMessage}
          </Typography>
        </Stack>

        <Stack spacing={1.5}>
          <SummaryRow
            label={t.goalComplianceChart}
            value={
              goalComplianceState === 'ready'
                ? formatGoalCompliance(latestGoalCompliance, t.noChartData)
                : resolveAnalyticsStateMessage(goalComplianceState, t)
            }
          />
          <SummaryRow
            label={t.wellbeingChart}
            value={
              wellbeingState === 'ready'
                ? formatNumericDelta(
                    computeWellbeingAverage(latestWellbeing),
                    computeWellbeingAverage(previousWellbeing),
                    '',
                    t.versusPreviousLabel,
                    t.noChartData,
                  )
                : resolveAnalyticsStateMessage(wellbeingState, t)
            }
          />
          <SummaryRow
            label={t.bodyMetricsChart}
            value={
              bodyMetricsState === 'ready'
                ? formatBodyWeightDelta(
                    latestBodyMetrics,
                    previousBodyMetrics,
                    unitSystem,
                    t.versusPreviousLabel,
                    t.noChartData,
                  )
                : resolveAnalyticsStateMessage(bodyMetricsState, t)
            }
          />
          <SummaryRow
            label={t.workoutVolumeChart}
            value={
              workoutVolumeState === 'ready'
                ? formatNumericDelta(
                    computeWorkoutVolumeTotal(latestWorkoutVolume),
                    computeWorkoutVolumeTotal(previousWorkoutVolume),
                    ` ${t.chartSets.toLowerCase()}`,
                    t.versusPreviousLabel,
                    t.noChartData,
                  )
                : resolveAnalyticsStateMessage(workoutVolumeState, t)
            }
          />
          <SummaryRow
            label={t.bodyMassIndexLabel}
            value={formatBmiMetric(analytics, translations)}
          />
          <SummaryRow
            label={t.proteinPerKgBodyWeightLabel}
            value={formatScalarMetric(
              analytics.summaryMetrics.proteinPerKgBodyWeight.value,
              ' g/kg',
              t.noChartData,
            )}
          />
          <SummaryRow
            label={t.hydrationAdherenceTrendLabel}
            value={formatRateTrendMetric(
              analytics.summaryMetrics.hydrationAdherenceTrend.currentRate,
              analytics.summaryMetrics.hydrationAdherenceTrend.previousRate,
              translations,
            )}
          />
          <SummaryRow
            label={t.sleepConsistencyLabel}
            value={formatRateTrendMetric(
              analytics.summaryMetrics.sleepConsistency.currentRate,
              analytics.summaryMetrics.sleepConsistency.previousRate,
              translations,
            )}
          />
          <SummaryRow
            label={t.macroAdherenceScoreLabel}
            value={formatRateTrendMetric(
              analytics.summaryMetrics.macroAdherenceScore.currentRate,
              analytics.summaryMetrics.macroAdherenceScore.previousRate,
              translations,
            )}
          />
        </Stack>
      </Stack>
    </DashboardAnalyticsCard>
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

function formatBmiMetric(
  analytics: DashboardAnalytics,
  translations: TranslationDictionary,
): string {
  const bmi = analytics.summaryMetrics.bmi;

  if (bmi.value == null || bmi.category == null) {
    return translations.dashboard.noChartData;
  }

  return `${bmi.value} · ${resolveBmiCategoryLabel(bmi.category, translations)}`;
}

function resolveBmiCategoryLabel(
  category: NonNullable<DashboardAnalytics['summaryMetrics']['bmi']['category']>,
  translations: TranslationDictionary,
): string {
  switch (category) {
    case 'underweight':
      return translations.dashboard.bmiCategoryUnderweight;
    case 'normal':
      return translations.dashboard.bmiCategoryNormal;
    case 'overweight':
      return translations.dashboard.bmiCategoryOverweight;
    case 'obesity':
      return translations.dashboard.bmiCategoryObesity;
  }
}

function formatScalarMetric(
  value: number | null,
  unitSuffix: string,
  emptyLabel: string,
): string {
  if (value == null) {
    return emptyLabel;
  }

  return `${value}${unitSuffix}`.trim();
}

function formatRateTrendMetric(
  current: number | null,
  previous: number | null,
  translations: TranslationDictionary,
): string {
  if (current == null) {
    return translations.dashboard.noChartData;
  }

  if (previous == null) {
    return `${current}%`;
  }

  const delta = current - previous;
  const formattedDelta = delta === 0 ? '0' : `${delta > 0 ? '+' : ''}${delta}`;

  return `${current}% (${formattedDelta}% ${translations.dashboard.versusPreviousLabel})`;
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
