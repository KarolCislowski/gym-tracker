import { Schema, type HydratedDocument, type Model } from 'mongoose';

import {
  dashboardWidgetIds,
  dashboardWidgetSizePresets,
  dashboardWidgetTones,
} from '@/features/dashboard/application/dashboard-widget-registry';

import { getTenantDbConnection } from '../mongoose.client';
import type { TenantDashboardLayout } from './tenant-dashboard-layout.types';

export type TenantDashboardLayoutDocument =
  HydratedDocument<TenantDashboardLayout>;

const tenantDashboardLayoutItemSchema = new Schema(
  {
    widgetId: {
      type: String,
      required: true,
      enum: dashboardWidgetIds,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
    sizePreset: {
      type: String,
      required: true,
      enum: dashboardWidgetSizePresets,
    },
    tone: {
      type: String,
      required: true,
      enum: dashboardWidgetTones,
    },
    cols: {
      type: Number,
      required: true,
      min: 1,
    },
    rows: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const tenantDashboardLayoutSchema = new Schema<TenantDashboardLayout>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
      enum: [1],
    },
    items: {
      type: [tenantDashboardLayoutItemSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'tenant_dashboard_layouts',
  },
);

/**
 * Returns the TenantDashboardLayout model bound to a specific tenant database.
 * @param tenantDbName - Name of the tenant database.
 * @returns A promise resolving to the dashboard layout model for the tenant database.
 */
export async function getTenantDashboardLayoutModel(
  tenantDbName: string,
): Promise<Model<TenantDashboardLayout>> {
  const connection = await getTenantDbConnection(tenantDbName);
  const existingModel = connection.models.TenantDashboardLayout as
    | Model<TenantDashboardLayout>
    | undefined;

  if (existingModel) {
    const hasLatestSchemaFields =
      Boolean(existingModel.schema.path('items.widgetId')) &&
      Boolean(existingModel.schema.path('items.sizePreset')) &&
      Boolean(existingModel.schema.path('items.tone'));

    if (hasLatestSchemaFields || process.env.NODE_ENV === 'production') {
      return existingModel;
    }

    connection.deleteModel('TenantDashboardLayout');
  }

  return connection.model<TenantDashboardLayout>(
    'TenantDashboardLayout',
    tenantDashboardLayoutSchema,
  );
}
