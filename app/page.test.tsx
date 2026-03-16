import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Page from '@/app/page';

afterEach(() => {
  cleanup();
});
/**
 * Verifies that the main page renders its primary heading.
 */
test('PageH1', () => {
  render(<Page />);
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined();
});
/**
 * Verifies that the main page renders its secondary heading.
 */
test('PageH2', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', { level: 2, name: 'About' }),
  ).toBeDefined();
});
