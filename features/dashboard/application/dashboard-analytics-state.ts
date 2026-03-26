import type {
  BodyMetricsChartPoint,
  GoalComplianceChartPoint,
  WellbeingChartPoint,
  WorkoutVolumeChartPoint,
} from './dashboard-analytics';

export type DashboardAnalyticsState =
  | 'ready'
  | 'start'
  | 'empty-period'
  | 'insufficient';

export function resolveAnalyticsStateMessage(
  state: DashboardAnalyticsState,
  translations: {
    noChartData: string;
    noDataInPeriod: string;
    notEnoughDataForTrend: string;
    startFirstEntry: string;
  },
): string {
  switch (state) {
    case 'start':
      return translations.startFirstEntry;
    case 'empty-period':
      return translations.noDataInPeriod;
    case 'insufficient':
      return translations.notEnoughDataForTrend;
    default:
      return translations.noChartData;
  }
}

export function resolveGoalComplianceState(
  points: GoalComplianceChartPoint[],
): DashboardAnalyticsState {
  return points.length ? 'ready' : 'start';
}

export function resolveWellbeingState(
  points: WellbeingChartPoint[],
): DashboardAnalyticsState {
  return resolveTrendState(
    points,
    (point) =>
      point.mood != null ||
      point.energy != null ||
      point.stress != null ||
      point.recovery != null,
  );
}

export function resolveBodyMetricsState(
  points: BodyMetricsChartPoint[],
): DashboardAnalyticsState {
  if (!points.length) {
    return 'start';
  }

  const bodyWeightPoints = points.filter((point) => point.bodyWeightKg != null);
  const heartRatePoints = points.filter((point) => point.restingHeartRate != null);

  if (!bodyWeightPoints.length && !heartRatePoints.length) {
    return 'empty-period';
  }

  if (bodyWeightPoints.length < 2 && heartRatePoints.length < 2) {
    return 'insufficient';
  }

  return 'ready';
}

export function resolveWorkoutVolumeState(
  points: WorkoutVolumeChartPoint[],
  muscleGroups: string[],
): DashboardAnalyticsState {
  if (!points.length) {
    return 'start';
  }

  if (!muscleGroups.length || !points.some((point) => computeWorkoutVolumeTotal(point) > 0)) {
    return 'empty-period';
  }

  if (points.length < 2) {
    return 'insufficient';
  }

  return 'ready';
}

export function getLatestWellbeingTrendPoints(
  points: WellbeingChartPoint[],
): [WellbeingChartPoint | undefined, WellbeingChartPoint | undefined] {
  return getLastTwoMeaningfulPoints(
    points,
    (point) =>
      point.mood != null ||
      point.energy != null ||
      point.stress != null ||
      point.recovery != null,
  );
}

export function getLatestBodyWeightTrendPoints(
  points: BodyMetricsChartPoint[],
): [BodyMetricsChartPoint | undefined, BodyMetricsChartPoint | undefined] {
  return getLastTwoMeaningfulPoints(points, (point) => point.bodyWeightKg != null);
}

export function getLatestWorkoutVolumeTrendPoints(
  points: WorkoutVolumeChartPoint[],
): [WorkoutVolumeChartPoint | undefined, WorkoutVolumeChartPoint | undefined] {
  return getLastTwoMeaningfulPoints(points, (point) => computeWorkoutVolumeTotal(point) > 0);
}

function resolveTrendState<T>(
  points: T[],
  hasValue: (point: T) => boolean,
): DashboardAnalyticsState {
  if (!points.length) {
    return 'start';
  }

  const meaningfulPoints = points.filter(hasValue);

  if (!meaningfulPoints.length) {
    return 'empty-period';
  }

  if (meaningfulPoints.length < 2) {
    return 'insufficient';
  }

  return 'ready';
}

function getLastTwoMeaningfulPoints<T>(
  points: T[],
  hasValue: (point: T) => boolean,
): [T | undefined, T | undefined] {
  const meaningfulPoints = points.filter(hasValue);
  return [
    meaningfulPoints.at(-1),
    meaningfulPoints.length > 1 ? meaningfulPoints.at(-2) : undefined,
  ];
}

function computeWorkoutVolumeTotal(point: WorkoutVolumeChartPoint): number {
  return Object.entries(point).reduce((sum, [key, value]) => {
    if (key === 'label' || typeof value !== 'number') {
      return sum;
    }

    return sum + value;
  }, 0);
}
