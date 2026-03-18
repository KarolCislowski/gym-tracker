import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Page from '@/app/page';

vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/features/auth/application/auth.service', () => ({
  getAuthenticatedUserSnapshot: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/features/auth/infrastructure/auth.actions', () => ({
  logoutAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
});
/**
 * Verifies that the main page renders its primary heading.
 */
test('PageH1', async () => {
  render(await Page());
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined();
});
/**
 * Verifies that the main page renders its secondary heading.
 */
test('PageH2', async () => {
  render(await Page());
  expect(
    screen.getByRole('heading', { level: 2, name: 'About' }),
  ).toBeDefined();
});
