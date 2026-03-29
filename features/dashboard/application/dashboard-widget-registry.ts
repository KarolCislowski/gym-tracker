export const dashboardWidgetRegistry = {
  overview: {
    defaultOrder: 0,
    defaultVisible: true,
    mdCols: 6,
    mdRows: 1,
    pinned: true,
    removable: false,
    sizePresets: {
      hero: { cols: 8, rows: 1 },
    },
  },
  next_action: {
    defaultOrder: 1,
    defaultVisible: true,
    mdCols: 6,
    mdRows: 1,
    pinned: true,
    removable: false,
    sizePresets: {
      summary: { cols: 4, rows: 1 },
    },
  },
  profile: {
    defaultOrder: 2,
    defaultVisible: true,
    mdCols: 3,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      regular: { cols: 4, rows: 1 },
      tall: { cols: 4, rows: 2 },
    },
  },
  healthy_habits: {
    defaultOrder: 3,
    defaultVisible: true,
    mdCols: 3,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      regular: { cols: 8, rows: 1 },
      wide: { cols: 12, rows: 1 },
    },
  },
  favorite_exercises: {
    defaultOrder: 4,
    defaultVisible: true,
    mdCols: 4,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      compact: { cols: 4, rows: 1 },
      regular: { cols: 5, rows: 1 },
    },
  },
  settings: {
    defaultOrder: 5,
    defaultVisible: true,
    mdCols: 2,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      compact: { cols: 3, rows: 1 },
    },
  },
  analytics: {
    defaultOrder: 6,
    defaultVisible: true,
    mdCols: 6,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      wide: { cols: 12, rows: 2 },
      hero: { cols: 12, rows: 3 },
    },
  },
} as const;

export type DashboardWidgetId = keyof typeof dashboardWidgetRegistry;

export type DashboardWidgetSizePreset = {
  [K in DashboardWidgetId]: keyof (typeof dashboardWidgetRegistry)[K]['sizePresets'];
}[DashboardWidgetId];

export const dashboardWidgetIds = Object.keys(
  dashboardWidgetRegistry,
) as DashboardWidgetId[];

export const dashboardWidgetSizePresets = Array.from(
  new Set(
    dashboardWidgetIds.flatMap((widgetId) =>
      Object.keys(dashboardWidgetRegistry[widgetId].sizePresets),
    ),
  ),
) as DashboardWidgetSizePreset[];
