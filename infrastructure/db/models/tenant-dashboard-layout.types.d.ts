import type { Types } from 'mongoose';

import type {
  DashboardWidgetId,
  DashboardWidgetSizePreset,
} from '@/features/dashboard/application/dashboard-widget-registry';

export interface TenantDashboardLayoutItem {
  cols: number;
  order: number;
  rows: number;
  sizePreset: DashboardWidgetSizePreset;
  visible: boolean;
  widgetId: DashboardWidgetId;
}

export interface TenantDashboardLayout {
  _id: Types.ObjectId;
  createdAt: Date;
  items: TenantDashboardLayoutItem[];
  updatedAt: Date;
  userId: string;
  version: 1;
}
