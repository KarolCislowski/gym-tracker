import { getTenantSupplementReportModel } from '@/infrastructure/db/models/tenant-supplement-report.model';
import { getTenantSupplementStackModel } from '@/infrastructure/db/models/tenant-supplement-stack.model';

import type {
  CreateSupplementIntakeReportInput,
  CreateSupplementStackInput,
  SupplementIntakeReportSummary,
  SupplementStackSummary,
} from '../domain/supplementation.types';

/**
 * Persists a tenant-owned supplement stack definition.
 * @param input - Validated stack payload.
 */
export async function createTenantSupplementStackRecord(
  input: CreateSupplementStackInput,
): Promise<void> {
  const TenantSupplementStackModel = await getTenantSupplementStackModel(
    input.tenantDbName,
  );

  await TenantSupplementStackModel.create({
    userId: input.userId,
    name: input.name,
    context: input.context,
    notes: input.notes,
    isFavorite: input.isFavorite,
    items: input.items,
  });
}

/**
 * Returns supplement stacks created by the authenticated tenant user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns Ordered supplement-stack summaries ready for UI rendering.
 */
export async function listTenantSupplementStackRecords(
  tenantDbName: string,
  userId: string,
): Promise<SupplementStackSummary[]> {
  const TenantSupplementStackModel = await getTenantSupplementStackModel(
    tenantDbName,
  );
  const records = await TenantSupplementStackModel.find({ userId })
    .sort({ isFavorite: -1, name: 1, createdAt: -1 })
    .lean();

  return records.map((record) => ({
    id: record._id.toString(),
    name: record.name,
    context: record.context,
    notes: record.notes ?? null,
    isFavorite: record.isFavorite,
    itemCount: record.items.length,
    items: record.items.map((item) => ({
      order: item.order,
      supplementId: item.supplementId,
      supplementSlug: item.supplementSlug,
      supplementName: item.supplementName,
      variantId: item.variantId ?? null,
      variantSlug: item.variantSlug ?? null,
      variantName: item.variantName ?? null,
      amount: item.amount,
      unit: item.unit,
      notes: item.notes ?? null,
    })),
  }));
}

/**
 * Persists a historical supplement-intake report.
 * @param input - Validated intake payload containing a stack snapshot.
 */
export async function createTenantSupplementIntakeReportRecord(
  input: CreateSupplementIntakeReportInput,
): Promise<void> {
  const TenantSupplementReportModel = await getTenantSupplementReportModel(
    input.tenantDbName,
  );

  await TenantSupplementReportModel.create({
    userId: input.userId,
    takenAt: input.takenAt,
    stackId: input.stackId,
    stackName: input.stackName,
    context: input.context,
    notes: input.notes,
    items: input.items,
  });
}

/**
 * Returns supplement-intake history for the authenticated tenant user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns Recent supplement-intake summaries ready for UI rendering.
 */
export async function listTenantSupplementIntakeReportRecords(
  tenantDbName: string,
  userId: string,
): Promise<SupplementIntakeReportSummary[]> {
  const TenantSupplementReportModel = await getTenantSupplementReportModel(
    tenantDbName,
  );
  const records = await TenantSupplementReportModel.find({ userId })
    .sort({ takenAt: -1, createdAt: -1 })
    .lean();

  return records.map((record) => ({
    id: record._id.toString(),
    takenAt: record.takenAt.toISOString(),
    stackId: record.stackId ?? null,
    stackName: record.stackName,
    context: record.context,
    notes: record.notes ?? null,
    itemCount: record.items.length,
    items: record.items.map((item) => ({
      order: item.order,
      supplementId: item.supplementId,
      supplementSlug: item.supplementSlug,
      supplementName: item.supplementName,
      variantId: item.variantId ?? null,
      variantSlug: item.variantSlug ?? null,
      variantName: item.variantName ?? null,
      amount: item.amount,
      unit: item.unit,
      notes: item.notes ?? null,
    })),
  }));
}
