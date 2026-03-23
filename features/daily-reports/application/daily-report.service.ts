import type {
  CreateDailyReportInput,
  DailyReportSummary,
} from '../domain/daily-report.types';
import { createDailyReportSchema } from '../domain/daily-report.validation';
import {
  createTenantDailyReportRecord,
  listTenantDailyReportRecords,
} from '../infrastructure/daily-report.db';

/**
 * Persists a daily report snapshot for the authenticated tenant user.
 * @param input - Tenant-scoped daily report submitted by the user.
 * @returns A promise that resolves when the daily report has been stored.
 */
export async function createDailyReport(
  input: CreateDailyReportInput,
): Promise<void> {
  createDailyReportSchema.parse(input);

  await createTenantDailyReportRecord(input);
}

/**
 * Lists daily report summaries for the authenticated tenant user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to reverse-chronological daily report summaries.
 */
export async function listDailyReports(
  tenantDbName: string,
  userId: string,
): Promise<DailyReportSummary[]> {
  return listTenantDailyReportRecords(tenantDbName, userId);
}
