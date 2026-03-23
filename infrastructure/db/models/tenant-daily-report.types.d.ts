export interface TenantDailyGoalsSnapshot {
  averageSleepHoursPerDay?: number | null;
  regularSleepSchedule?: boolean | null;
  stepsPerDay?: number | null;
  waterLitersPerDay?: number | null;
  proteinGramsPerDay?: number | null;
  strengthWorkoutsPerWeek?: number | null;
  cardioMinutesPerWeek?: number | null;
}

export interface TenantDailyActuals {
  sleepHours?: number | null;
  sleepScheduleKept?: boolean | null;
  steps?: number | null;
  waterLiters?: number | null;
  proteinGrams?: number | null;
  strengthWorkoutDone?: boolean | null;
  cardioMinutes?: number | null;
}

export interface TenantDailyWellbeing {
  mood?: 1 | 2 | 3 | 4 | 5 | null;
  energy?: 1 | 2 | 3 | 4 | 5 | null;
  stress?: 1 | 2 | 3 | 4 | 5 | null;
  soreness?: 1 | 2 | 3 | 4 | 5 | null;
  motivation?: 1 | 2 | 3 | 4 | 5 | null;
  recovery?: 1 | 2 | 3 | 4 | 5 | null;
}

export interface TenantDailyBodySnapshot {
  bodyWeightKg?: number | null;
  restingHeartRate?: number | null;
}

export interface TenantDailyWeatherSnapshot {
  provider: string;
  temperatureC?: number | null;
  apparentTemperatureC?: number | null;
  humidityPercent?: number | null;
  windSpeedKph?: number | null;
  precipitationMm?: number | null;
  weatherCode?: string | null;
  capturedAt: Date;
}

export interface TenantDailyContext {
  weatherSnapshot?: TenantDailyWeatherSnapshot | null;
  menstruationPhase?: string | null;
  illness?: boolean | null;
  notes?: string | null;
}

export interface TenantDailyCompletion {
  sleepGoalMet?: boolean | null;
  stepsGoalMet?: boolean | null;
  waterGoalMet?: boolean | null;
  proteinGoalMet?: boolean | null;
  cardioGoalMet?: boolean | null;
}

export interface TenantDailyReport {
  userId: string;
  reportDate: Date;
  goalsSnapshot: TenantDailyGoalsSnapshot;
  actuals: TenantDailyActuals;
  wellbeing: TenantDailyWellbeing;
  body: TenantDailyBodySnapshot;
  dayContext: TenantDailyContext;
  completion: TenantDailyCompletion;
  createdAt: Date;
  updatedAt: Date;
}
