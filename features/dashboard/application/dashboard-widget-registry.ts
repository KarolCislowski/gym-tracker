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
  activity_calendar: {
    allowedTones: ['neutral'] as const,
    defaultOrder: 6,
    defaultTone: 'neutral' as const,
    defaultVisible: true,
    mdCols: 4,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      regular: { cols: 5, rows: 1 },
      wide: { cols: 6, rows: 1 },
      tall: { cols: 5, rows: 2 },
    },
  },
  analytics_goal_compliance: {
    allowedTones: ['neutral'] as const,
    defaultOrder: 7,
    defaultTone: 'neutral' as const,
    defaultVisible: true,
    mdCols: 3,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      regular: { cols: 6, rows: 1 },
      wide: { cols: 8, rows: 1 },
    },
  },
  analytics_summary_metrics: {
    allowedTones: ['neutral'] as const,
    defaultOrder: 8,
    defaultTone: 'neutral' as const,
    defaultVisible: true,
    mdCols: 3,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      regular: { cols: 4, rows: 1 },
      wide: { cols: 6, rows: 1 },
    },
  },
  analytics_wellbeing: {
    allowedTones: ['neutral'] as const,
    defaultOrder: 9,
    defaultTone: 'neutral' as const,
    defaultVisible: true,
    mdCols: 6,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      wide: { cols: 6, rows: 1 },
      hero: { cols: 8, rows: 1 },
    },
  },
  analytics_body_metrics: {
    allowedTones: ['neutral'] as const,
    defaultOrder: 10,
    defaultTone: 'neutral' as const,
    defaultVisible: true,
    mdCols: 6,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      wide: { cols: 6, rows: 1 },
      hero: { cols: 8, rows: 1 },
    },
  },
  analytics_workout_volume: {
    allowedTones: ['neutral'] as const,
    defaultOrder: 11,
    defaultTone: 'neutral' as const,
    defaultVisible: true,
    mdCols: 6,
    mdRows: 1,
    pinned: false,
    removable: true,
    sizePresets: {
      wide: { cols: 6, rows: 1 },
      hero: { cols: 8, rows: 1 },
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
