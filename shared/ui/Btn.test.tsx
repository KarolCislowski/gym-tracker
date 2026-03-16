/**
 * @vitest-environment jsdom
 * This file contains unit tests for the Btn component in the shared/ui directory.
 * It uses Vitest as the testing framework and React Testing Library for rendering and querying the component.
 * The tests verify that the Btn component renders with the correct text and applies the specified background color.
 */
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Btn } from './Btn';

afterEach(() => {
  cleanup();
});

/**
 * Verifies that the Btn component renders with the correct text and color.
 */
test('BtnText', () => {
  render(<Btn text='Click Me' color='blue' />);
  const button = screen.getByRole('button', { name: 'Click Me' });
  expect(button).toBeDefined();
});
/**
 * Verifies that the Btn component applies the correct background color.
 */
test('BtnColor', () => {
  render(<Btn text='Click Me' color='blue' />);
  const button = screen.getByRole('button', { name: 'Click Me' });
  expect(screen.getByRole('button').getAttribute('style')).toContain(
    'background-color: blue',
  );
});
