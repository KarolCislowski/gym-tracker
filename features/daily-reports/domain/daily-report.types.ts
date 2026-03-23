export type MenstruationPhase =
  | 'menstruation'
  | 'follicular'
  | 'ovulation'
  | 'luteal'
  | 'unknown';

export interface DailyGoalsSnapshotInput {
  averageSleepHoursPerDay: number | null;
  regularSleepSchedule: boolean | null;
  stepsPerDay: number | null;
  waterLitersPerDay: number | null;
  proteinGramsPerDay: number | null;
  strengthWorkoutsPerWeek: number | null;
  cardioMinutesPerWeek: number | null;
}

export interface DailyActualsInput {
  sleepHours: number | null;
  sleepScheduleKept: boolean | null;
  steps: number | null;
  waterLiters: number | null;
  proteinGrams: number | null;
  strengthWorkoutDone: boolean | null;
  cardioMinutes: number | null;
}

export interface DailyWellbeingInput {
  mood: 1 | 2 | 3 | 4 | 5 | null;
  energy: 1 | 2 | 3 | 4 | 5 | null;
  stress: 1 | 2 | 3 | 4 | 5 | null;
  soreness: 1 | 2 | 3 | 4 | 5 | null;
  libido: 1 | 2 | 3 | 4 | 5 | null;
  motivation: 1 | 2 | 3 | 4 | 5 | null;
  recovery: 1 | 2 | 3 | 4 | 5 | null;
}

export interface DailyBodySnapshotInput {
  bodyWeightKg: number | null;
  restingHeartRate: number | null;
}

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

export interface DailyContextInput {
  weatherSnapshot: DailyWeatherSnapshotInput | null;
  menstruationPhase: MenstruationPhase | null;
  illness: boolean | null;
  notes: string | null;
}

export interface DailyCompletionInput {
  sleepGoalMet: boolean | null;
  stepsGoalMet: boolean | null;
  waterGoalMet: boolean | null;
  proteinGoalMet: boolean | null;
  cardioGoalMet: boolean | null;
}

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

export interface UpdateDailyReportInput extends CreateDailyReportInput {
  reportId: string;
}

export interface DailyReportSummary {
  id: string;
  reportDate: string;
  wellbeing: DailyWellbeingInput;
  body: DailyBodySnapshotInput;
  completion: DailyCompletionInput;
  actuals: DailyActualsInput;
}

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
