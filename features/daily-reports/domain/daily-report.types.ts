/**
 * Supported menstrual-cycle phases captured in daily context when cycle tracking is enabled.
 */
export type MenstruationPhase =
  | 'menstruation'
  | 'follicular'
  | 'ovulation'
  | 'luteal'
  | 'unknown';

/**
 * Snapshot of the user's saved daily goals embedded into a report at creation time.
 */
export interface DailyGoalsSnapshotInput {
  averageSleepHoursPerDay: number | null;
  regularSleepSchedule: boolean | null;
  stepsPerDay: number | null;
  waterLitersPerDay: number | null;
  caloriesPerDay?: number | null;
  carbsGramsPerDay?: number | null;
  proteinGramsPerDay: number | null;
  fatGramsPerDay?: number | null;
  strengthWorkoutsPerWeek: number | null;
  cardioMinutesPerWeek: number | null;
}

/**
 * Measured or reported daily execution values captured by the check-in form.
 */
export interface DailyActualsInput {
  sleepHours: number | null;
  sleepScheduleKept: boolean | null;
  steps: number | null;
  waterLiters: number | null;
  calories?: number | null;
  carbsGrams?: number | null;
  proteinGrams: number | null;
  fatGrams?: number | null;
  strengthWorkoutDone: boolean | null;
  cardioMinutes: number | null;
}

/**
 * Subjective daily wellbeing ratings recorded on a five-point scale.
 */
export interface DailyWellbeingInput {
  mood: 1 | 2 | 3 | 4 | 5 | null;
  energy: 1 | 2 | 3 | 4 | 5 | null;
  stress: 1 | 2 | 3 | 4 | 5 | null;
  soreness: 1 | 2 | 3 | 4 | 5 | null;
  libido: 1 | 2 | 3 | 4 | 5 | null;
  motivation: 1 | 2 | 3 | 4 | 5 | null;
  recovery: 1 | 2 | 3 | 4 | 5 | null;
}

/**
 * Daily body-state metrics captured alongside wellbeing and habit execution.
 */
export interface DailyBodySnapshotInput {
  bodyWeightKg: number | null;
  restingHeartRate: number | null;
}

/**
 * Weather context captured for the report day when available.
 */
export interface DailyWeatherSnapshotInput {
  provider: string;
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  humidityPercent: number | null;
  windSpeedKph: number | null;
  precipitationMm: number | null;
  weatherCode: string | null;
  capturedAt: Date;
}

/**
 * Qualitative daily context not covered by goals, actuals, or body metrics.
 */
export interface DailyContextInput {
  weatherSnapshot: DailyWeatherSnapshotInput | null;
  menstruationPhase: MenstruationPhase | null;
  illness: boolean | null;
  notes: string | null;
}

/**
 * Goal-completion flags derived at report creation or update time.
 */
export interface DailyCompletionInput {
  sleepGoalMet: boolean | null;
  stepsGoalMet: boolean | null;
  waterGoalMet: boolean | null;
  caloriesGoalMet?: boolean | null;
  carbsGoalMet?: boolean | null;
  proteinGoalMet: boolean | null;
  fatGoalMet?: boolean | null;
  cardioGoalMet: boolean | null;
}

/**
 * Full input used when creating a persisted daily report.
 */
export interface CreateDailyReportInput {
  tenantDbName: string;
  userId: string;
  reportDate: Date;
  goalsSnapshot: DailyGoalsSnapshotInput;
  actuals: DailyActualsInput;
  wellbeing: DailyWellbeingInput;
  body: DailyBodySnapshotInput;
  dayContext: DailyContextInput;
  completion: DailyCompletionInput;
}

/**
 * Update payload for an existing daily report.
 */
export interface UpdateDailyReportInput extends CreateDailyReportInput {
  reportId: string;
}

/**
 * Lightweight daily report projection used in history lists, dashboard widgets, and analytics.
 */
export interface DailyReportSummary {
  id: string;
  reportDate: string;
  wellbeing: DailyWellbeingInput;
  body: DailyBodySnapshotInput;
  completion: DailyCompletionInput;
  actuals: DailyActualsInput;
}

/**
 * Fully expanded daily report projection used by the details and editor flows.
 */
export interface DailyReportDetails {
  id: string;
  reportDate: string;
  goalsSnapshot: DailyGoalsSnapshotInput;
  actuals: DailyActualsInput;
  wellbeing: DailyWellbeingInput;
  body: DailyBodySnapshotInput;
  dayContext: DailyContextInput;
  completion: DailyCompletionInput;
}
