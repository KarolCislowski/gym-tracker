import type { DailyReportSummary } from '@/features/daily-reports/domain/daily-report.types';
import type { WorkoutSessionSummary } from '@/features/workouts/domain/workout.types';

export interface DashboardActivityCalendarWorkoutEntry {
  id: string;
  workoutName: string;
}

export interface DashboardActivityCalendarDay {
  dailyReportId: string | null;
  dateKey: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  workoutReports: DashboardActivityCalendarWorkoutEntry[];
}

export interface DashboardActivityCalendarMonth {
  days: DashboardActivityCalendarDay[];
  monthEndKey: string;
  monthStartKey: string;
}

interface BuildDashboardActivityCalendarMonthInput {
  dailyReports: DailyReportSummary[];
  now?: Date;
  referenceDate?: Date;
  workoutSessions: WorkoutSessionSummary[];
}

/**
 * Builds a month-scoped calendar model that merges daily reports and workouts by UTC calendar day.
 * @param input - Source reports and optional reference dates used to shape the current month grid.
 * @returns A calendar month model ready for dashboard rendering and day-level drill-down.
 */
export function buildDashboardActivityCalendarMonth({
  dailyReports,
  now = new Date(),
  referenceDate = now,
  workoutSessions,
}: BuildDashboardActivityCalendarMonthInput): DashboardActivityCalendarMonth {
  const monthStart = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1),
  );
  const monthEnd = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1, 0),
  );
  const startWeekday = (monthStart.getUTCDay() + 6) % 7;
  const endWeekday = (monthEnd.getUTCDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setUTCDate(monthStart.getUTCDate() - startWeekday);
  const gridEnd = new Date(monthEnd);
  gridEnd.setUTCDate(monthEnd.getUTCDate() + (6 - endWeekday));
  const dailyReportsByDay = new Map(
    dailyReports.map((report) => [toUtcDateKey(new Date(report.reportDate)), report.id]),
  );
  const workoutsByDay = workoutSessions.reduce<
    Map<string, DashboardActivityCalendarWorkoutEntry[]>
  >((accumulator, session) => {
    const dateKey = toUtcDateKey(new Date(session.performedAt));
    const current = accumulator.get(dateKey) ?? [];
    current.push({ id: session.id, workoutName: session.workoutName });
    accumulator.set(dateKey, current);
    return accumulator;
  }, new Map());
  const todayKey = toUtcDateKey(now);
  const days: DashboardActivityCalendarDay[] = [];

  for (
    let current = new Date(gridStart);
    current <= gridEnd;
    current.setUTCDate(current.getUTCDate() + 1)
  ) {
    const dateKey = toUtcDateKey(current);

    days.push({
      dateKey,
      dayOfMonth: current.getUTCDate(),
      isCurrentMonth: current.getUTCMonth() === referenceDate.getUTCMonth(),
      isToday: dateKey === todayKey,
      dailyReportId: dailyReportsByDay.get(dateKey) ?? null,
      workoutReports: workoutsByDay.get(dateKey) ?? [],
    });
  }

  return {
    days,
    monthStartKey: toUtcDateKey(monthStart),
    monthEndKey: toUtcDateKey(monthEnd),
  };
}

/**
 * Returns a stable initial day selection for the calendar widget.
 * @param month - Calendar month model visible in the widget.
 * @returns The most useful date key to preselect for inspection.
 */
export function resolveDashboardActivityCalendarSelection(
  month: DashboardActivityCalendarMonth,
): string {
  const today = month.days.find((day) => day.isToday && day.isCurrentMonth);

  if (today) {
    return today.dateKey;
  }

  const firstDayWithEntries = month.days.find(
    (day) =>
      day.isCurrentMonth &&
      (day.dailyReportId != null || day.workoutReports.length > 0),
  );

  if (firstDayWithEntries) {
    return firstDayWithEntries.dateKey;
  }

  return month.monthStartKey;
}

function toUtcDateKey(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}
