import { describe, expect, test } from 'vitest';

import { resolveDashboardLayout } from './dashboard-layout.service';

describe('resolveDashboardLayout', () => {
  test('returns the default ordered widget mosaic when no saved layout exists', () => {
    const result = resolveDashboardLayout([]);

    expect(result.map((item) => item.widgetId)).toEqual([
      'overview',
      'next_action',
      'profile',
      'healthy_habits',
      'favorite_exercises',
      'settings',
      'activity_calendar',
      'analytics_goal_compliance',
      'analytics_summary_metrics',
      'analytics_wellbeing',
      'analytics_body_metrics',
      'analytics_workout_volume',
    ]);
    expect(
      result.find((item) => item.widgetId === 'analytics_goal_compliance'),
    ).toMatchObject({
      sizePreset: 'regular',
      tone: 'neutral',
      cols: { xs: 1, md: 3, xl: 6 },
      rows: { xs: 1, md: 1, xl: 1 },
    });
  });

  test('keeps pinned widgets visible and sanitizes unsupported presets', () => {
    const result = resolveDashboardLayout([
      {
        widgetId: 'next_action',
        visible: false,
        order: 6,
        sizePreset: 'wide',
        tone: 'accent',
      },
      {
        widgetId: 'profile',
        visible: true,
        order: 0,
        sizePreset: 'tall',
        tone: 'accent',
      },
    ]);

    expect(result.find((item) => item.widgetId === 'next_action')).toMatchObject({
      visible: true,
      sizePreset: 'summary',
      tone: 'neutral',
    });
    expect(result.find((item) => item.widgetId === 'profile')).toMatchObject({
      order: 1,
      sizePreset: 'tall',
      tone: 'accent',
      cols: { xs: 1, md: 3, xl: 4 },
      rows: { xs: 1, md: 1, xl: 2 },
    });
  });

  test('migrates the legacy analytics widget into separate analytics cards', () => {
    const result = resolveDashboardLayout([
      {
        widgetId: 'analytics',
        visible: true,
        order: 6,
        sizePreset: 'hero',
        tone: 'neutral',
      },
    ]);

    expect(result.map((item) => item.widgetId)).toEqual([
      'overview',
      'next_action',
      'profile',
      'healthy_habits',
      'favorite_exercises',
      'settings',
      'activity_calendar',
      'analytics_goal_compliance',
      'analytics_summary_metrics',
      'analytics_wellbeing',
      'analytics_body_metrics',
      'analytics_workout_volume',
    ]);
    expect(
      result.find((item) => item.widgetId === 'analytics_goal_compliance'),
    ).toMatchObject({
      visible: true,
      order: 7,
    });
    expect(
      result.find((item) => item.widgetId === 'analytics_workout_volume'),
    ).toMatchObject({
      visible: true,
      order: 11,
    });
  });
});
