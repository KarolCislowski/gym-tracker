import type { DailyReportSummary } from '@/features/daily-reports/domain/daily-report.types';
import type { Exercise } from '@/features/exercises/domain/exercise.types';
import { formatAtlasToken } from '@/features/exercises/application/exercise-atlas-grid';
import type { WorkoutSessionSummary } from '@/features/workouts/domain/workout.types';
import type { WorkoutSessionAnalytics } from '@/features/workouts/domain/workout.types';

export interface GoalComplianceChartPoint {
  [key: string]: string | number | null;
  label: string;
  sleep: number;
  steps: number;
  water: number;
  protein: number;
  cardio: number;
}

export interface WellbeingChartPoint {
  [key: string]: string | number | null;
  label: string;
  mood: number | null;
  energy: number | null;
  stress: number | null;
  recovery: number | null;
}

export interface BodyMetricsChartPoint {
  [key: string]: string | number | null;
  label: string;
  bodyWeightKg: number | null;
  restingHeartRate: number | null;
}

export interface WorkoutVolumeChartPoint {
  [key: string]: string | number | null;
  label: string;
}

export interface DashboardAnalytics {
  goalCompliance: GoalComplianceChartPoint[];
  wellbeing: WellbeingChartPoint[];
  bodyMetrics: BodyMetricsChartPoint[];
  workoutVolume: WorkoutVolumeChartPoint[];
  workoutVolumeMuscleGroups: string[];
  workoutVolumeMuscleGroupLabels: Record<string, string>;
}

/**
 * Builds dashboard-ready chart series from daily reports and workout summaries.
 * @param dailyReports - Reverse-chronological daily report summaries.
 * @param workoutSessions - Reverse-chronological workout session summaries.
 * @returns Normalized analytics series for the dashboard chart widgets.
 */
export function buildDashboardAnalytics(
  dailyReports: DailyReportSummary[],
  workoutSessions: WorkoutSessionSummary[],
  workoutSessionsForAnalytics: WorkoutSessionAnalytics[],
  exercises: Exercise[],
): DashboardAnalytics {
  return {
    goalCompliance: buildGoalComplianceSeries(dailyReports),
    wellbeing: buildWellbeingSeries(dailyReports),
    bodyMetrics: buildBodyMetricsSeries(dailyReports),
    ...buildWorkoutVolumeSeries(workoutSessions, workoutSessionsForAnalytics, exercises),
  };
}

function buildGoalComplianceSeries(
  dailyReports: DailyReportSummary[],
): GoalComplianceChartPoint[] {
  return [...dailyReports]
    .slice(0, 14)
    .reverse()
    .map((report) => ({
      label: formatShortDate(report.reportDate),
      sleep: report.completion.sleepGoalMet ? 1 : 0,
      steps: report.completion.stepsGoalMet ? 1 : 0,
      water: report.completion.waterGoalMet ? 1 : 0,
      protein: report.completion.proteinGoalMet ? 1 : 0,
      cardio: report.completion.cardioGoalMet ? 1 : 0,
    }));
}

function buildWellbeingSeries(
  dailyReports: DailyReportSummary[],
): WellbeingChartPoint[] {
  return [...dailyReports]
    .slice(0, 14)
    .reverse()
    .map((report) => ({
      label: formatShortDate(report.reportDate),
      mood: report.wellbeing.mood,
      energy: report.wellbeing.energy,
      stress: report.wellbeing.stress,
      recovery: report.wellbeing.recovery,
    }));
}

function buildBodyMetricsSeries(
  dailyReports: DailyReportSummary[],
): BodyMetricsChartPoint[] {
  return [...dailyReports]
    .slice(0, 14)
    .reverse()
    .map((report) => ({
      label: formatShortDate(report.reportDate),
      bodyWeightKg: report.body.bodyWeightKg,
      restingHeartRate: report.body.restingHeartRate,
    }));
}

function buildWorkoutVolumeSeries(
  workoutSessions: WorkoutSessionSummary[],
  workoutSessionsForAnalytics: WorkoutSessionAnalytics[],
  exercises: Exercise[],
): Pick<
  DashboardAnalytics,
  'workoutVolume' | 'workoutVolumeMuscleGroups' | 'workoutVolumeMuscleGroupLabels'
> {
  const exerciseMap = new Map(exercises.map((exercise) => [exercise.slug, exercise]));
  const sessionsByWeek = new Map<string, Record<string, number>>();
  const totalsByMuscleGroup = new Map<string, number>();
  const workoutSessionIds = new Set(workoutSessions.map((session) => session.id));

  workoutSessionsForAnalytics
    .filter((session) => workoutSessionIds.has(session.id))
    .forEach((session) => {
      const key = formatIsoWeekKey(session.performedAt);
      const current = sessionsByWeek.get(key) ?? {};

      session.entries.forEach((entry) => {
        const exercise = exerciseMap.get(entry.exerciseSlug);
        const primaryMuscleGroups = resolvePrimaryMuscleGroups(
          exercise,
          entry.variantId,
        );

        primaryMuscleGroups.forEach((muscleGroup) => {
          current[muscleGroup] = (current[muscleGroup] ?? 0) + entry.setCount;
          totalsByMuscleGroup.set(
            muscleGroup,
            (totalsByMuscleGroup.get(muscleGroup) ?? 0) + entry.setCount,
          );
        });
      });

      sessionsByWeek.set(key, current);
    });

  const workoutVolumeMuscleGroups = Array.from(totalsByMuscleGroup.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([muscleGroup]) => muscleGroup);

  const workoutVolume = Array.from(sessionsByWeek.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-8)
    .map(([label, totals]) =>
      workoutVolumeMuscleGroups.reduce<WorkoutVolumeChartPoint>(
        (point, muscleGroup) => {
          point[muscleGroup] = totals[muscleGroup] ?? 0;
          return point;
        },
        { label },
      ),
    );

  return {
    workoutVolume,
    workoutVolumeMuscleGroups,
    workoutVolumeMuscleGroupLabels: Object.fromEntries(
      workoutVolumeMuscleGroups.map((muscleGroup) => [
        muscleGroup,
        formatAtlasToken(muscleGroup),
      ]),
    ),
  };
}

function resolvePrimaryMuscleGroups(
  exercise: Exercise | undefined,
  variantId: string | null,
): string[] {
  if (!exercise) {
    return [];
  }

  const variant = variantId
    ? exercise.variants.find((currentVariant) => currentVariant.id === variantId)
    : undefined;
  const muscles = variant?.musclesOverride?.length
    ? variant.musclesOverride
    : exercise.muscles;

  return Array.from(
    new Set(
      muscles
        .filter((muscle) => muscle.role === 'primary')
        .map((muscle) => muscle.muscleGroupId),
    ),
  );
}

function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${month}/${day}`;
}

function formatIsoWeekKey(isoDate: string): string {
  const date = new Date(isoDate);
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = utcDate.getUTCDay() || 7;

  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    (((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7,
  );

  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}
