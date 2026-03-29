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
      'analytics',
    ]);
    expect(result.find((item) => item.widgetId === 'analytics')).toMatchObject({
      sizePreset: 'wide',
      tone: 'neutral',
      cols: { xs: 1, md: 6, xl: 12 },
      rows: { xs: 1, md: 1, xl: 2 },
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
});
