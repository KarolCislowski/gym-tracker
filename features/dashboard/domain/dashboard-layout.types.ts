import type {
  DashboardWidgetId,
  DashboardWidgetSizePreset,
} from '../application/dashboard-widget-registry';

export interface DashboardLayoutPreferenceItem {
  order: number;
  sizePreset: DashboardWidgetSizePreset;
  visible: boolean;
  widgetId: DashboardWidgetId;
}

export interface SaveDashboardLayoutInput {
  items: DashboardLayoutPreferenceItem[];
  tenantDbName: string;
  userId: string;
}

export interface DashboardLayoutRecordItem extends DashboardLayoutPreferenceItem {
  cols: number;
  rows: number;
}

export interface DashboardLayoutRecord {
  items: DashboardLayoutRecordItem[];
  updatedAt: string;
  userId: string;
  version: 1;
}

export interface ResolvedDashboardLayoutItem extends DashboardLayoutPreferenceItem {
  allowedSizePresets: DashboardWidgetSizePreset[];
  cols: { md: number; xs: number; xl: number };
  pinned: boolean;
  removable: boolean;
  rows: { md: number; xs: number; xl: number };
}
