import { getTenantDailyReportModel } from '@/infrastructure/db/models/tenant-daily-report.model';

import type {
  CreateDailyReportInput,
  DailyReportDetails,
  DailyReportSummary,
  UpdateDailyReportInput,
} from '../domain/daily-report.types';

/**
 * Persists a tenant daily report snapshot.
 * @param input - Validated daily report values to persist.
 * @returns A promise that resolves when the daily report document has been created.
 */
export async function createTenantDailyReportRecord(
  input: CreateDailyReportInput,
): Promise<void> {
  const TenantDailyReportModel = await getTenantDailyReportModel(input.tenantDbName);

  await TenantDailyReportModel.create({
    userId: input.userId,
    reportDate: input.reportDate,
    goalsSnapshot: input.goalsSnapshot,
    actuals: input.actuals,
    wellbeing: input.wellbeing,
    body: input.body,
    dayContext: input.dayContext,
    completion: input.completion,
  });
}

/**
 * Updates a persisted tenant daily report.
 * @param input - Validated daily report values together with the stable report id.
 * @returns A promise that resolves when the report has been updated.
 */
export async function updateTenantDailyReportRecord(
  input: UpdateDailyReportInput,
): Promise<void> {
  const TenantDailyReportModel = await getTenantDailyReportModel(input.tenantDbName);

  await TenantDailyReportModel.updateOne(
    { _id: input.reportId, userId: input.userId },
    {
      $set: {
        reportDate: input.reportDate,
        goalsSnapshot: input.goalsSnapshot,
        actuals: input.actuals,
        wellbeing: input.wellbeing,
        body: input.body,
        dayContext: input.dayContext,
        completion: input.completion,
      },
    },
  );
}

/**
 * Lists persisted daily reports for a tenant-scoped user in reverse chronological order.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to lightweight daily report summaries.
 */
export async function listTenantDailyReportRecords(
  tenantDbName: string,
  userId: string,
): Promise<DailyReportSummary[]> {
  const TenantDailyReportModel = await getTenantDailyReportModel(tenantDbName);
  const reports = await TenantDailyReportModel.find({ userId })
    .sort({ reportDate: -1 })
    .lean();

  return reports.map((report) => ({
    id: report._id.toString(),
    reportDate: report.reportDate.toISOString(),
    wellbeing: {
      mood: report.wellbeing?.mood ?? null,
      energy: report.wellbeing?.energy ?? null,
      stress: report.wellbeing?.stress ?? null,
      soreness: report.wellbeing?.soreness ?? null,
      libido: report.wellbeing?.libido ?? null,
      motivation: report.wellbeing?.motivation ?? null,
      recovery: report.wellbeing?.recovery ?? null,
    },
    completion: {
      sleepGoalMet: report.completion?.sleepGoalMet ?? null,
      stepsGoalMet: report.completion?.stepsGoalMet ?? null,
      waterGoalMet: report.completion?.waterGoalMet ?? null,
      proteinGoalMet: report.completion?.proteinGoalMet ?? null,
      cardioGoalMet: report.completion?.cardioGoalMet ?? null,
    },
    actuals: {
      sleepHours: report.actuals?.sleepHours ?? null,
      sleepScheduleKept: report.actuals?.sleepScheduleKept ?? null,
      steps: report.actuals?.steps ?? null,
      waterLiters: report.actuals?.waterLiters ?? null,
      proteinGrams: report.actuals?.proteinGrams ?? null,
      strengthWorkoutDone: report.actuals?.strengthWorkoutDone ?? null,
      cardioMinutes: report.actuals?.cardioMinutes ?? null,
    },
  }));
}

/**
 * Resolves a full persisted daily report for a tenant-scoped user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @param reportId - Stable report identifier.
 * @returns A detailed daily report or `null` when it does not exist.
 */
export async function findTenantDailyReportRecordById(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<DailyReportDetails | null> {
  const TenantDailyReportModel = await getTenantDailyReportModel(tenantDbName);
  const report = await TenantDailyReportModel.findOne({
    _id: reportId,
    userId,
  }).lean();

  if (!report) {
    return null;
  }

  return {
    id: report._id.toString(),
    reportDate: report.reportDate.toISOString(),
    goalsSnapshot: {
      averageSleepHoursPerDay: report.goalsSnapshot?.averageSleepHoursPerDay ?? null,
      regularSleepSchedule: report.goalsSnapshot?.regularSleepSchedule ?? null,
      stepsPerDay: report.goalsSnapshot?.stepsPerDay ?? null,
      waterLitersPerDay: report.goalsSnapshot?.waterLitersPerDay ?? null,
      proteinGramsPerDay: report.goalsSnapshot?.proteinGramsPerDay ?? null,
      strengthWorkoutsPerWeek: report.goalsSnapshot?.strengthWorkoutsPerWeek ?? null,
      cardioMinutesPerWeek: report.goalsSnapshot?.cardioMinutesPerWeek ?? null,
    },
    actuals: {
      sleepHours: report.actuals?.sleepHours ?? null,
      sleepScheduleKept: report.actuals?.sleepScheduleKept ?? null,
      steps: report.actuals?.steps ?? null,
      waterLiters: report.actuals?.waterLiters ?? null,
      proteinGrams: report.actuals?.proteinGrams ?? null,
      strengthWorkoutDone: report.actuals?.strengthWorkoutDone ?? null,
      cardioMinutes: report.actuals?.cardioMinutes ?? null,
    },
    wellbeing: {
      mood: report.wellbeing?.mood ?? null,
      energy: report.wellbeing?.energy ?? null,
      stress: report.wellbeing?.stress ?? null,
      soreness: report.wellbeing?.soreness ?? null,
      libido: report.wellbeing?.libido ?? null,
      motivation: report.wellbeing?.motivation ?? null,
      recovery: report.wellbeing?.recovery ?? null,
    },
    body: {
      bodyWeightKg: report.body?.bodyWeightKg ?? null,
      restingHeartRate: report.body?.restingHeartRate ?? null,
    },
    dayContext: {
      weatherSnapshot: report.dayContext?.weatherSnapshot
        ? {
            provider: report.dayContext.weatherSnapshot.provider,
            temperatureC: report.dayContext.weatherSnapshot.temperatureC ?? null,
            apparentTemperatureC:
              report.dayContext.weatherSnapshot.apparentTemperatureC ?? null,
            humidityPercent:
              report.dayContext.weatherSnapshot.humidityPercent ?? null,
            windSpeedKph: report.dayContext.weatherSnapshot.windSpeedKph ?? null,
            precipitationMm:
              report.dayContext.weatherSnapshot.precipitationMm ?? null,
            weatherCode: report.dayContext.weatherSnapshot.weatherCode ?? null,
            capturedAt: report.dayContext.weatherSnapshot.capturedAt,
          }
        : null,
      menstruationPhase: report.dayContext?.menstruationPhase ?? null,
      illness: report.dayContext?.illness ?? null,
      notes: report.dayContext?.notes ?? null,
    },
    completion: {
      sleepGoalMet: report.completion?.sleepGoalMet ?? null,
      stepsGoalMet: report.completion?.stepsGoalMet ?? null,
      waterGoalMet: report.completion?.waterGoalMet ?? null,
      proteinGoalMet: report.completion?.proteinGoalMet ?? null,
      cardioGoalMet: report.completion?.cardioGoalMet ?? null,
    },
  };
}
