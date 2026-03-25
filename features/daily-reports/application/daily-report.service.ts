import type {
  CreateDailyReportInput,
  DailyReportDetails,
  DailyReportSummary,
  UpdateDailyReportInput,
} from '../domain/daily-report.types';
import {
  createDailyReportSchema,
  updateDailyReportSchema,
} from '../domain/daily-report.validation';
import {
  createTenantDailyReportRecord,
  deleteTenantDailyReportRecord,
  findTenantDailyReportRecordById,
  listTenantDailyReportRecords,
  updateTenantDailyReportRecord,
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

/**
 * Resolves a full daily report for the authenticated tenant user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @param reportId - Stable report identifier.
 * @returns A detailed daily report or `null` when it does not exist.
 */
export async function getDailyReportDetails(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<DailyReportDetails | null> {
  return findTenantDailyReportRecordById(tenantDbName, userId, reportId);
}

/**
 * Updates a stored daily report for the authenticated tenant user.
 * @param input - Tenant-scoped daily report update payload.
 * @returns A promise that resolves when the daily report has been updated.
 */
export async function updateDailyReport(
  input: UpdateDailyReportInput,
): Promise<void> {
  updateDailyReportSchema.parse(input);

  await updateTenantDailyReportRecord(input);
}

export async function deleteDailyReport(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<void> {
  await deleteTenantDailyReportRecord(tenantDbName, userId, reportId);
}
