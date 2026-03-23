import { getTenantDailyReportModel } from '@/infrastructure/db/models/tenant-daily-report.model';

import type { CreateDailyReportInput, DailyReportSummary } from '../domain/daily-report.types';

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
