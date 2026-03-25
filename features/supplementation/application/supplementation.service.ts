import {
  createTenantSupplementIntakeReportRecord,
  createTenantSupplementStackRecord,
  deleteTenantSupplementIntakeReportRecord,
  deleteTenantSupplementStackRecord,
  findTenantSupplementIntakeReportRecordById,
  findTenantSupplementStackRecordById,
  listTenantSupplementIntakeReportRecords,
  listTenantSupplementStackRecords,
  updateTenantSupplementIntakeReportRecord,
  updateTenantSupplementStackRecord,
} from '../infrastructure/supplementation.db';
import type {
  CreateSupplementIntakeReportInput,
  CreateSupplementStackInput,
  SupplementIntakeReportSummary,
  SupplementStackSummary,
  UpdateSupplementIntakeReportInput,
  UpdateSupplementStackInput,
} from '../domain/supplementation.types';
import {
  createSupplementIntakeReportSchema,
  createSupplementStackSchema,
  updateSupplementIntakeReportSchema,
  updateSupplementStackSchema,
} from '../domain/supplementation.validation';

/**
 * Creates a reusable user-owned supplement stack.
 * @param input - Candidate stack payload submitted from the UI.
 */
export async function createSupplementStack(
  input: CreateSupplementStackInput,
): Promise<void> {
  await createTenantSupplementStackRecord(createSupplementStackSchema.parse(input));
}

export async function getSupplementStackDetails(
  tenantDbName: string,
  userId: string,
  stackId: string,
): Promise<SupplementStackSummary | null> {
  return findTenantSupplementStackRecordById(tenantDbName, userId, stackId);
}

export async function updateSupplementStack(
  input: UpdateSupplementStackInput,
): Promise<void> {
  updateSupplementStackSchema.parse(input);

  await updateTenantSupplementStackRecord(input);
}

export async function deleteSupplementStack(
  tenantDbName: string,
  userId: string,
  stackId: string,
): Promise<void> {
  await deleteTenantSupplementStackRecord(tenantDbName, userId, stackId);
}

/**
 * Returns saved supplement stacks for the authenticated user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns Ordered stack summaries for supplementation screens.
 */
export async function listSupplementStacks(
  tenantDbName: string,
  userId: string,
): Promise<SupplementStackSummary[]> {
  return listTenantSupplementStackRecords(tenantDbName, userId);
}

/**
 * Creates a historical supplement-intake report from a stack snapshot.
 * @param input - Candidate intake-report payload submitted from the UI.
 */
export async function createSupplementIntakeReport(
  input: CreateSupplementIntakeReportInput,
): Promise<void> {
  await createTenantSupplementIntakeReportRecord(
    createSupplementIntakeReportSchema.parse(input),
  );
}

export async function getSupplementIntakeReportDetails(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<SupplementIntakeReportSummary | null> {
  return findTenantSupplementIntakeReportRecordById(tenantDbName, userId, reportId);
}

export async function updateSupplementIntakeReport(
  input: UpdateSupplementIntakeReportInput,
): Promise<void> {
  updateSupplementIntakeReportSchema.parse(input);

  await updateTenantSupplementIntakeReportRecord(input);
}

export async function deleteSupplementIntakeReport(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<void> {
  await deleteTenantSupplementIntakeReportRecord(tenantDbName, userId, reportId);
}

/**
 * Returns supplement-intake history for the authenticated user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns Ordered supplement-intake summaries for history tables.
 */
export async function listSupplementIntakeReports(
  tenantDbName: string,
  userId: string,
): Promise<SupplementIntakeReportSummary[]> {
  return listTenantSupplementIntakeReportRecords(tenantDbName, userId);
}
