import type { DailyReportSummary } from '@/features/daily-reports/domain/daily-report.types';
import type { WorkoutSessionSummary } from '@/features/workouts/domain/workout.types';

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
  sessions: number;
  exercises: number;
  sets: number;
}

export interface DashboardAnalytics {
  goalCompliance: GoalComplianceChartPoint[];
  wellbeing: WellbeingChartPoint[];
  bodyMetrics: BodyMetricsChartPoint[];
  workoutVolume: WorkoutVolumeChartPoint[];
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
): DashboardAnalytics {
  return {
    goalCompliance: buildGoalComplianceSeries(dailyReports),
    wellbeing: buildWellbeingSeries(dailyReports),
    bodyMetrics: buildBodyMetricsSeries(dailyReports),
    workoutVolume: buildWorkoutVolumeSeries(workoutSessions),
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
): WorkoutVolumeChartPoint[] {
  const sessionsByWeek = new Map<
    string,
    { exercises: number; sessions: number; sets: number }
  >();

  [...workoutSessions]
    .slice(0, 56)
    .forEach((session) => {
      const key = formatIsoWeekKey(session.performedAt);
      const current = sessionsByWeek.get(key) ?? {
        sessions: 0,
        exercises: 0,
        sets: 0,
      };

      sessionsByWeek.set(key, {
        sessions: current.sessions + 1,
        exercises: current.exercises + session.exerciseCount,
        sets: current.sets + session.setCount,
      });
    });

  return Array.from(sessionsByWeek.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-8)
    .map(([label, totals]) => ({
      label,
      sessions: totals.sessions,
      exercises: totals.exercises,
      sets: totals.sets,
    }));
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
