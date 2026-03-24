/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { SupplementAtlasPage } from './supplement-atlas-page';

describe('SupplementAtlasPage', () => {
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
