import { z } from 'zod';

import {
  dashboardWidgetIds,
  dashboardWidgetSizePresets,
} from '../application/dashboard-widget-registry';

const widgetIdSchema = z.enum(dashboardWidgetIds);
const widgetSizePresetSchema = z.enum(dashboardWidgetSizePresets);

export const dashboardLayoutPreferenceItemSchema = z.object({
  order: z.number().int().min(0),
  sizePreset: widgetSizePresetSchema,
  visible: z.boolean(),
  widgetId: widgetIdSchema,
});

export const saveDashboardLayoutSchema = z.object({
  items: z.array(dashboardLayoutPreferenceItemSchema),
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
});
