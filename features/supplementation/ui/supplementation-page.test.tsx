/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { SupplementationPage } from './supplementation-page';

vi.mock('./supplement-intake-composer', () => ({
  SupplementIntakeComposer: () => <div>supplement-intake-composer</div>,
}));

vi.mock('./supplement-stack-composer', () => ({
  SupplementStackComposer: () => <div>supplement-stack-composer</div>,
}));

vi.mock('../infrastructure/supplementation.actions', () => ({
  deleteSupplementIntakeReportAction: vi.fn(),
}));

describe('SupplementationPage', () => {
  /**
   * Verifies that supplementation stacks and report history render on the page.
   */
  test('renders stack and report sections', async () => {
    render(
      <SupplementationPage
        reports={[
          {
            id: 'report-1',
            takenAt: '2026-03-24T07:15:00.000Z',
            stackId: 'stack-1',
            stackName: 'PWO',
            context: 'pre_workout',
            notes: 'Leg day',
            itemCount: 2,
            items: [],
          },
        ]}
        stacks={[
          {
            id: 'stack-1',
            name: 'PWO',
            context: 'pre_workout',
            notes: 'Heavy session',
            isFavorite: true,
            itemCount: 2,
            items: [],
          },
        ]}
        status='supplement-stack-created'
        supplements={[
          {
            id: 'supplement-1',
            name: 'Creatine',
            slug: 'creatine',
            category: 'performance',
            evidenceLevel: 'strong',
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
        ]}
        translations={enMessages}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Supplementation' }),
    ).toBeInTheDocument();
    expect(screen.getByText('My supplement stacks')).toBeInTheDocument();
    expect(screen.getByText('Supplement intake history')).toBeInTheDocument();
    expect(screen.getAllByText('PWO').length).toBeGreaterThan(0);
  });
});
