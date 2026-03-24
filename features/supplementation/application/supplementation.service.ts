import {
  createTenantSupplementIntakeReportRecord,
  createTenantSupplementStackRecord,
  listTenantSupplementIntakeReportRecords,
  listTenantSupplementStackRecords,
} from '../infrastructure/supplementation.db';
import type {
  CreateSupplementIntakeReportInput,
  CreateSupplementStackInput,
  SupplementIntakeReportSummary,
  SupplementStackSummary,
} from '../domain/supplementation.types';
import {
  createSupplementIntakeReportSchema,
  createSupplementStackSchema,
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
