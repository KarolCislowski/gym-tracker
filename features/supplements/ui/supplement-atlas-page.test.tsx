/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { SupplementAtlasPage } from './supplement-atlas-page';

describe('SupplementAtlasPage', () => {
  test('shows a mobile portrait atlas notice instead of the table', async () => {
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches:
        query.includes('max-width') || query.includes('orientation: portrait'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <SupplementAtlasPage
        supplements={[]}
        translations={enMessages}
      />,
    );

    expect(
      await screen.findByText('Atlas available on larger screens'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'The full supplement atlas uses a wide comparison table, so it is hidden in portrait mobile view.',
      ),
    ).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });

  /**
   * Verifies that the supplement atlas renders rows and heading content.
   */
  test('renders the supplement atlas data grid', async () => {
    render(
      <SupplementAtlasPage
        supplements={[
          {
            id: 'supplement-1',
            name: 'Creatine',
            slug: 'creatine',
            category: 'performance',
            evidenceLevel: 'strong',
            goals: ['strength', 'power'],
            variants: [
              {
                id: 'variant-1',
                name: 'Creatine Monohydrate',
                slug: 'creatine-monohydrate',
                form: 'powder',
                compoundType: 'monohydrate',
                typicalDose: '3-5 g daily',
                timing: ['daily'],
                isDefault: true,
              },
            ],
            isActive: true,
          },
          {
            id: 'supplement-2',
            name: 'Magnesium',
            slug: 'magnesium',
            category: 'health',
            evidenceLevel: 'moderate',
            goals: ['sleep'],
            variants: [
              {
                id: 'variant-2',
                name: 'Magnesium Glycinate',
                slug: 'magnesium-glycinate',
                form: 'capsule',
                compoundType: 'glycinate',
                typicalDose: 'Product-specific dose',
                timing: ['evening'],
              },
            ],
            isActive: true,
          },
        ]}
        translations={enMessages}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Supplement atlas' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Creatine')).toBeInTheDocument();
  });

  /**
   * Verifies that client-side filtering narrows supplement rows by category.
   */
  test('filters the supplement atlas by category', async () => {
    render(
      <SupplementAtlasPage
        supplements={[
          {
            id: 'supplement-1',
            name: 'Creatine',
            slug: 'creatine',
            category: 'performance',
            evidenceLevel: 'strong',
            goals: ['strength'],
            variants: [
              {
                id: 'variant-1',
                name: 'Creatine Monohydrate',
                slug: 'creatine-monohydrate',
                form: 'powder',
                compoundType: 'monohydrate',
                typicalDose: '3-5 g daily',
                timing: ['daily'],
              },
            ],
            isActive: true,
          },
          {
            id: 'supplement-2',
            name: 'Magnesium',
            slug: 'magnesium',
            category: 'health',
            evidenceLevel: 'moderate',
            goals: ['sleep'],
            variants: [
              {
                id: 'variant-2',
                name: 'Magnesium Glycinate',
                slug: 'magnesium-glycinate',
                form: 'capsule',
                compoundType: 'glycinate',
                typicalDose: 'Product-specific dose',
                timing: ['evening'],
              },
            ],
            isActive: true,
          },
        ]}
        translations={enMessages}
      />,
    );

    fireEvent.mouseDown(screen.getByLabelText('Category'));
    fireEvent.click(await screen.findByRole('option', { name: 'Health' }));

    expect(screen.queryByText('Creatine')).not.toBeInTheDocument();
    expect(screen.getByText('Magnesium')).toBeInTheDocument();
  });
});
