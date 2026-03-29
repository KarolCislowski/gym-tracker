export const dashboardWidgetTones = [
  'accent',
  'glass',
  'neutral',
  'soft',
] as const;

export type DashboardWidgetTone = (typeof dashboardWidgetTones)[number];

export const dashboardWidgetRegistry = {
  overview: {
    allowedTones: ['neutral'] as const,
    defaultOrder: 0,
    defaultTone: 'neutral' as const,
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
    allowedTones: ['neutral'] as const,
    defaultOrder: 1,
    defaultTone: 'neutral' as const,
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
    allowedTones: ['soft', 'accent', 'neutral'] as const,
    defaultOrder: 2,
    defaultTone: 'soft' as const,
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
    allowedTones: ['accent', 'soft', 'neutral'] as const,
    defaultOrder: 3,
    defaultTone: 'accent' as const,
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
    allowedTones: ['soft', 'neutral', 'glass'] as const,
    defaultOrder: 4,
    defaultTone: 'soft' as const,
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
    allowedTones: ['glass', 'neutral', 'soft'] as const,
    defaultOrder: 5,
    defaultTone: 'glass' as const,
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
    allowedTones: ['neutral'] as const,
    defaultOrder: 6,
    defaultTone: 'neutral' as const,
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

export type DashboardWidgetAllowedTone = {
  [K in DashboardWidgetId]: (typeof dashboardWidgetRegistry)[K]['allowedTones'][number];
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
