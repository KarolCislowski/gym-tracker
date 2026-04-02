import type {
  DashboardWidgetId,
  DashboardWidgetSizePreset,
  DashboardWidgetTone,
} from '../application/dashboard-widget-registry';

/**
 * User-controlled dashboard widget preference persisted independently from resolved grid data.
 */
export interface DashboardLayoutPreferenceItem {
  order: number;
  sizePreset: DashboardWidgetSizePreset;
  tone: DashboardWidgetTone;
  visible: boolean;
  widgetId: DashboardWidgetId;
}

/**
 * Input used when saving a complete per-user dashboard layout preference set.
 */
export interface SaveDashboardLayoutInput {
  items: DashboardLayoutPreferenceItem[];
  tenantDbName: string;
  userId: string;
}

/**
 * Persisted dashboard layout item enriched with the resolved grid dimensions written to storage.
 */
export interface DashboardLayoutRecordItem extends DashboardLayoutPreferenceItem {
  cols: number;
  rows: number;
}

/**
 * Stored dashboard layout document for a single tenant user.
 */
export interface DashboardLayoutRecord {
  items: DashboardLayoutRecordItem[];
  updatedAt: string;
  userId: string;
  version: 1;
}

/**
 * Dashboard layout item after defaults, allowed presets, and responsive dimensions have been resolved.
 */
export interface ResolvedDashboardLayoutItem extends DashboardLayoutPreferenceItem {
  allowedSizePresets: DashboardWidgetSizePreset[];
  allowedTones: DashboardWidgetTone[];
  cols: { md: number; xs: number; xl: number };
  pinned: boolean;
  removable: boolean;
  rows: { md: number; xs: number; xl: number };
}
