import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { DailyReportSummary } from '@/features/daily-reports/domain/daily-report.types';
import type { WorkoutSessionSummary } from '@/features/workouts/domain/workout.types';

export type DashboardNextActionKind =
  | 'complete_profile'
  | 'set_goals'
  | 'first_daily_report'
  | 'first_workout'
  | 'today_daily_report'
  | 'this_week_workout'
  | 'review_progress';

export interface DashboardNextAction {
  href: string;
  kind: DashboardNextActionKind;
}

interface ResolveDashboardNextActionInput {
  dailyReports: DailyReportSummary[];
  now?: Date;
  userSnapshot: AuthenticatedUserSnapshot | null;
  workoutSessions: WorkoutSessionSummary[];
}

/**
 * Resolves the single highest-priority next step to surface on the dashboard.
 * @param input - Current user context and report history available on the dashboard.
 * @returns The most relevant next action for the current state of the account.
 */
export function resolveDashboardNextAction({
  dailyReports,
  now = new Date(),
  userSnapshot,
  workoutSessions,
}: ResolveDashboardNextActionInput): DashboardNextAction {
  if (!isProfileReady(userSnapshot?.profile ?? null)) {
    return { kind: 'complete_profile', href: '/profile' };
  }

  if (!hasHealthyHabitsGoals(userSnapshot?.healthyHabits ?? null)) {
    return { kind: 'set_goals', href: '/profile' };
  }

  if (!dailyReports.length) {
    return { kind: 'first_daily_report', href: '/daily-reports' };
  }

  if (!workoutSessions.length) {
    return { kind: 'first_workout', href: '/workouts' };
  }

  if (!hasDailyReportForDate(dailyReports, now)) {
    return { kind: 'today_daily_report', href: '/daily-reports' };
  }

  if (!hasWorkoutInLastSevenDays(workoutSessions, now)) {
    return { kind: 'this_week_workout', href: '/workouts' };
  }

  return { kind: 'review_progress', href: '/#dashboard-analytics' };
}

function isProfileReady(
  profile: AuthenticatedUserSnapshot['profile'],
): boolean {
  if (!profile) {
    return false;
  }

  return Boolean(
    profile.birthDate &&
      profile.heightCm != null &&
      profile.gender &&
      profile.activityLevel,
  );
}

function hasHealthyHabitsGoals(
  healthyHabits: AuthenticatedUserSnapshot['healthyHabits'],
): boolean {
  if (!healthyHabits) {
    return false;
  }

  return Boolean(
    healthyHabits.averageSleepHoursPerDay != null &&
      healthyHabits.stepsPerDay != null &&
      healthyHabits.waterLitersPerDay != null &&
      healthyHabits.proteinGramsPerDay != null &&
      healthyHabits.strengthWorkoutsPerWeek != null,
  );
}

function hasDailyReportForDate(
  dailyReports: DailyReportSummary[],
  now: Date,
): boolean {
  const todayKey = toUtcDateKey(now);

  return dailyReports.some((report) => toUtcDateKey(new Date(report.reportDate)) === todayKey);
}

function hasWorkoutInLastSevenDays(
  workoutSessions: WorkoutSessionSummary[],
  now: Date,
): boolean {
  const windowStart = new Date(now);
  windowStart.setUTCDate(windowStart.getUTCDate() - 7);

  return workoutSessions.some((session) => {
    const performedAt = new Date(session.performedAt);
    return performedAt >= windowStart && performedAt <= now;
  });
}

function toUtcDateKey(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}
