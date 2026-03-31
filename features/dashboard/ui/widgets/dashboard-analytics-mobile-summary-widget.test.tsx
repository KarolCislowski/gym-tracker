/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { DashboardAnalyticsMobileSummaryWidget } from './dashboard-analytics-mobile-summary-widget';

describe('DashboardAnalyticsMobileSummaryWidget', () => {
  test('renders lightweight mobile status summaries instead of full charts', () => {
    render(
      <DashboardAnalyticsMobileSummaryWidget
        analytics={{
          goalCompliance: [
            {
              label: '03/21',
              sleep: 1,
              steps: 1,
              water: 1,
              protein: 1,
              cardio: 0,
            },
          ],
          wellbeing: [
            {
              label: '03/20',
              mood: 3,
              energy: 3,
              stress: 2,
              recovery: 3,
            },
            {
              label: '03/21',
              mood: 4,
              energy: 4,
              stress: 2,
              recovery: 4,
            },
          ],
          bodyMetrics: [
            {
              label: '03/20',
              bodyWeightKg: 80,
              restingHeartRate: 55,
            },
            {
              label: '03/21',
              bodyWeightKg: 81.5,
              restingHeartRate: 54,
            },
          ],
          workoutVolume: [
            {
              label: '2026-W11',
              pectorals: 8,
              lats: 6,
            },
            {
              label: '2026-W12',
              pectorals: 10,
              lats: 8,
            },
          ],
          workoutVolumeMuscleGroups: ['pectorals', 'lats'],
          workoutVolumeMuscleGroupLabels: {
            pectorals: 'Pectorals',
            lats: 'Lats',
          },
          summaryMetrics: {
            bmi: { value: 24.8, category: 'normal' },
            proteinPerKgBodyWeight: { value: 2.1 },
            hydrationAdherenceTrend: { currentRate: 71, previousRate: 57 },
            sleepConsistency: { currentRate: 86, previousRate: 71 },
            macroAdherenceScore: { currentRate: 78, previousRate: 64 },
          },
        }}
        translations={enMessages}
        unitSystem='metric'
      />,
    );

    expect(screen.getByText('Quick status')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Detailed charts and deeper analysis are available on larger screens.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('4/5')).toBeInTheDocument();
    expect(screen.getByText('+0.7 vs previous')).toBeInTheDocument();
    expect(screen.getByText('+1.5 kg vs previous')).toBeInTheDocument();
    expect(screen.getByText('+4 sets vs previous')).toBeInTheDocument();
    expect(screen.getByText('24.8 · Normal')).toBeInTheDocument();
    expect(screen.getByText('2.1 g/kg')).toBeInTheDocument();
    expect(screen.getByText('71% (+14% vs previous)')).toBeInTheDocument();
  });

  test('renders onboarding-style empty states when analytics have no entries yet', () => {
    render(
      <DashboardAnalyticsMobileSummaryWidget
        analytics={{
          goalCompliance: [],
          wellbeing: [],
          bodyMetrics: [],
          workoutVolume: [],
          workoutVolumeMuscleGroups: [],
          workoutVolumeMuscleGroupLabels: {},
          summaryMetrics: {
            bmi: { value: null, category: null },
            proteinPerKgBodyWeight: { value: null },
            hydrationAdherenceTrend: { currentRate: null, previousRate: null },
            sleepConsistency: { currentRate: null, previousRate: null },
            macroAdherenceScore: { currentRate: null, previousRate: null },
          },
        }}
        translations={enMessages}
        unitSystem='metric'
      />,
    );

    expect(
      screen.getAllByText('Start with your first entry.').length,
    ).toBeGreaterThan(1);
  });
});
