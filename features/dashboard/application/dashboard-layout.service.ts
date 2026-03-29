import {
  dashboardWidgetIds,
  dashboardWidgetRegistry,
  type DashboardWidgetSizePreset,
  type DashboardWidgetTone,
} from './dashboard-widget-registry';
import { saveDashboardLayoutSchema } from '../domain/dashboard-layout.validation';
import type {
  DashboardLayoutPreferenceItem,
  DashboardLayoutRecordItem,
  ResolvedDashboardLayoutItem,
  SaveDashboardLayoutInput,
} from '../domain/dashboard-layout.types';
import {
  deleteTenantDashboardLayoutRecord,
  findTenantDashboardLayoutRecord,
  upsertTenantDashboardLayoutRecord,
} from '../infrastructure/dashboard-layout.db';

/**
 * Resolves the effective dashboard layout by merging defaults with any saved per-user overrides.
 * @param tenantDbName - Name of the tenant database.
 * @param userId - Identifier of the authenticated tenant user.
 * @returns A resolved layout ready for dashboard rendering and customization.
 */
export async function getResolvedDashboardLayout(
  tenantDbName: string,
  userId: string,
): Promise<ResolvedDashboardLayoutItem[]> {
  const savedLayout = await findTenantDashboardLayoutRecord(tenantDbName, userId);
  return resolveDashboardLayout(savedLayout?.items ?? []);
}

/**
 * Saves dashboard layout preferences for the authenticated tenant user.
 * @param input - User-specific dashboard layout preferences submitted from the customization UI.
 * @returns A promise that resolves when the layout has been validated and persisted.
 */
export async function saveDashboardLayout(
  input: SaveDashboardLayoutInput,
): Promise<void> {
  const parsed = saveDashboardLayoutSchema.parse(input);
  const items = normalizeDashboardLayoutPreferences(parsed.items);

  await upsertTenantDashboardLayoutRecord(parsed.tenantDbName, parsed.userId, items);
}

/**
 * Removes the stored dashboard layout so the user falls back to defaults.
 * @param tenantDbName - Name of the tenant database.
 * @param userId - Identifier of the authenticated tenant user.
 * @returns A promise that resolves when the custom layout has been removed.
 */
export async function resetDashboardLayout(
  tenantDbName: string,
  userId: string,
): Promise<void> {
  await deleteTenantDashboardLayoutRecord(tenantDbName, userId);
}

/**
 * Resolves default and saved widget preferences into renderable dashboard layout items.
 * @param savedItems - Saved widget preferences loaded from persistence.
 * @returns A sanitized, fully populated dashboard layout.
 */
export function resolveDashboardLayout(
  savedItems: Array<
    Pick<
      DashboardLayoutRecordItem,
      'order' | 'sizePreset' | 'tone' | 'visible' | 'widgetId'
    >
  >,
): ResolvedDashboardLayoutItem[] {
  const savedById = new Map(savedItems.map((item) => [item.widgetId, item]));

  const resolved = dashboardWidgetIds.map((widgetId) => {
    const definition = dashboardWidgetRegistry[widgetId];
    const saved = savedById.get(widgetId);
    const allowedSizePresets = Object.keys(
      definition.sizePresets,
    ) as DashboardWidgetSizePreset[];
    const allowedTones = [...definition.allowedTones] as DashboardWidgetTone[];
    const sizePreset = allowedSizePresets.includes(saved?.sizePreset as DashboardWidgetSizePreset)
      ? (saved?.sizePreset as DashboardWidgetSizePreset)
      : (allowedSizePresets[0] as DashboardWidgetSizePreset);
    const tone = allowedTones.includes(saved?.tone as DashboardWidgetTone)
      ? (saved?.tone as DashboardWidgetTone)
      : (definition.defaultTone as DashboardWidgetTone);
    const preset = definition.sizePresets[
      sizePreset as keyof typeof definition.sizePresets
    ] as { cols: number; rows: number };

    return {
      widgetId,
      visible: definition.pinned ? true : saved?.visible ?? definition.defaultVisible,
      order: saved?.order ?? definition.defaultOrder,
      sizePreset,
      tone,
      cols: { xs: 1, md: definition.mdCols, xl: preset.cols },
      rows: { xs: 1, md: definition.mdRows, xl: preset.rows },
      allowedSizePresets,
      allowedTones,
      pinned: definition.pinned,
      removable: definition.removable,
    };
  });

  return resolved
    .sort((left, right) => {
      if (left.order === right.order) {
        return left.widgetId.localeCompare(right.widgetId);
      }

      return left.order - right.order;
    })
    .map((item, index) => ({
      ...item,
      order: index,
    }));
}

function normalizeDashboardLayoutPreferences(
  items: DashboardLayoutPreferenceItem[],
): DashboardLayoutRecordItem[] {
  return resolveDashboardLayout(items).map((item) => ({
    widgetId: item.widgetId,
    visible: item.visible,
    order: item.order,
    sizePreset: item.sizePreset,
    tone: item.tone,
    cols: item.cols.xl,
    rows: item.rows.xl,
  }));
}
