import { getTenantDashboardLayoutModel } from '@/infrastructure/db/models/tenant-dashboard-layout.model';

import type { DashboardLayoutRecord, DashboardLayoutRecordItem } from '../domain/dashboard-layout.types';

/**
 * Finds a stored dashboard layout for the authenticated tenant user.
 * @param tenantDbName - Name of the tenant database.
 * @param userId - Identifier of the authenticated tenant user.
 * @returns The stored dashboard layout or `null` when no custom layout exists.
 */
export async function findTenantDashboardLayoutRecord(
  tenantDbName: string,
  userId: string,
): Promise<DashboardLayoutRecord | null> {
  const TenantDashboardLayoutModel = await getTenantDashboardLayoutModel(
    tenantDbName,
  );
  const record = await TenantDashboardLayoutModel.findOne({ userId }).lean();

  if (!record) {
    return null;
  }

  return {
    userId: record.userId,
    version: 1,
    updatedAt: record.updatedAt.toISOString(),
    items: record.items.map((item) => ({
      widgetId: item.widgetId,
      visible: item.visible,
      order: item.order,
      sizePreset: item.sizePreset,
      cols: item.cols,
      rows: item.rows,
    })),
  };
}

/**
 * Persists a dashboard layout for the authenticated tenant user.
 * @param tenantDbName - Name of the tenant database.
 * @param userId - Identifier of the authenticated tenant user.
 * @param items - Normalized layout items to persist.
 * @returns A promise that resolves when the layout has been written.
 */
export async function upsertTenantDashboardLayoutRecord(
  tenantDbName: string,
  userId: string,
  items: DashboardLayoutRecordItem[],
): Promise<void> {
  const TenantDashboardLayoutModel = await getTenantDashboardLayoutModel(
    tenantDbName,
  );

  await TenantDashboardLayoutModel.updateOne(
    { userId },
    {
      $set: {
        userId,
        version: 1,
        items: items.map((item) => ({
          widgetId: item.widgetId,
          visible: item.visible,
          order: item.order,
          sizePreset: item.sizePreset,
          cols: item.cols,
          rows: item.rows,
        })),
      },
    },
    { upsert: true },
  );
}

/**
 * Deletes a stored dashboard layout for the authenticated tenant user.
 * @param tenantDbName - Name of the tenant database.
 * @param userId - Identifier of the authenticated tenant user.
 * @returns A promise that resolves when the custom layout has been removed.
 */
export async function deleteTenantDashboardLayoutRecord(
  tenantDbName: string,
  userId: string,
): Promise<void> {
  const TenantDashboardLayoutModel = await getTenantDashboardLayoutModel(
    tenantDbName,
  );

  await TenantDashboardLayoutModel.deleteOne({ userId });
}
