import { describe, expect, test } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { resolveNavigationItems } from './app-side-drawer';

describe('resolveNavigationItems', () => {
  test('hides atlas links from mobile navigation', () => {
    const items = resolveNavigationItems(enMessages.dashboard, 'John Doe');

    expect(items.mobile.map((item) => item.href)).toEqual([
      '/',
      '/profile',
      '/workouts',
      '/daily-reports',
      '/supplementation',
      '/settings',
    ]);
  });

  test('places atlas links below reports on larger screens', () => {
    const items = resolveNavigationItems(enMessages.dashboard, 'John Doe');

    expect(items.desktop.map((item) => item.href)).toEqual([
      '/',
      '/profile',
      '/workouts',
      '/daily-reports',
      '/supplementation',
      '/exercises',
      '/supplements',
      '/settings',
    ]);
  });
});
