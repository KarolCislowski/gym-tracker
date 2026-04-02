import type {
  BodyMetricsChartPoint,
  GoalComplianceChartPoint,
  WellbeingChartPoint,
  WorkoutVolumeChartPoint,
} from './dashboard-analytics';

/**
 * Product-facing state describing whether an analytics view is ready, empty, or under-populated.
 */
export type DashboardAnalyticsState =
  | 'ready'
  | 'start'
  | 'empty-period'
  | 'insufficient';

/**
 * Maps an analytics state to the localized empty-state copy shown in dashboard widgets.
 * @param state - Resolved analytics state for the current widget.
 * @param translations - Translation subset containing the supported analytics-state messages.
 * @returns The message that should be displayed for the given state.
 */
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

/**
 * Resolves the goal-compliance widget state from the available chart points.
 * @param points - Goal-compliance points prepared for chart rendering.
 * @returns The analytics state for the goal-compliance widget.
 */
export function resolveGoalComplianceState(
  points: GoalComplianceChartPoint[],
): DashboardAnalyticsState {
  return points.length ? 'ready' : 'start';
}

/**
 * Resolves the wellbeing widget state based on the presence of meaningful wellbeing values.
 * @param points - Wellbeing points prepared for chart rendering.
 * @returns The analytics state for the wellbeing widget.
 */
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

/**
 * Resolves the body-metrics widget state from body-weight and resting-heart-rate availability.
 * @param points - Body-metrics points prepared for chart rendering.
 * @returns The analytics state for the body-metrics widget.
 */
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

/**
 * Resolves the workout-volume widget state from populated points and muscle-group coverage.
 * @param points - Workout-volume points prepared for chart rendering.
 * @param muscleGroups - Muscle groups currently represented in the dataset.
 * @returns The analytics state for the workout-volume widget.
 */
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

/**
 * Returns the latest two wellbeing points containing at least one meaningful value.
 * @param points - Wellbeing points prepared for chart rendering.
 * @returns A tuple containing the latest point and the previous meaningful point when available.
 */
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

/**
 * Returns the latest two body-weight points containing a measured body weight.
 * @param points - Body-metrics points prepared for chart rendering.
 * @returns A tuple containing the latest point and the previous meaningful point when available.
 */
export function getLatestBodyWeightTrendPoints(
  points: BodyMetricsChartPoint[],
): [BodyMetricsChartPoint | undefined, BodyMetricsChartPoint | undefined] {
  return getLastTwoMeaningfulPoints(points, (point) => point.bodyWeightKg != null);
}

/**
 * Returns the latest two workout-volume points with a non-zero computed total.
 * @param points - Workout-volume points prepared for chart rendering.
 * @returns A tuple containing the latest point and the previous meaningful point when available.
 */
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
