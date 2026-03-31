/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { DashboardAnalyticsWidget } from './dashboard-analytics-widget';

describe('DashboardAnalyticsWidget', () => {
  test('renders goal compliance as an accessible heatmap table', () => {
    render(
      <DashboardAnalyticsWidget
        analytics={{
          goalCompliance: [
            {
              label: '03/21',
              sleep: 1,
              steps: 0,
              water: 1,
              protein: 1,
              cardio: 0,
            },
          ],
          wellbeing: [],
          bodyMetrics: [],
          workoutVolume: [],
          workoutVolumeMuscleGroups: [],
          workoutVolumeMuscleGroupLabels: {},
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

    expect(
      screen.getByRole('table', { name: 'Goal compliance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Sleep goal, 03/21: Yes'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Steps per day, 03/21: No'),
    ).toBeInTheDocument();
    expect(screen.getByText('24.8 · Normal')).toBeInTheDocument();
  });

  test('renders body weight chart label in imperial units when requested', async () => {
    render(
      <DashboardAnalyticsWidget
        analytics={{
          goalCompliance: [],
          wellbeing: [],
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
        unitSystem='imperial_us'
      />,
    );

    const showAllButton = screen.queryByRole('button', { name: 'Show all' });

    if (showAllButton) {
      fireEvent.click(showAllButton);
    }

    expect(await screen.findByText('Body weight (lb)')).toBeInTheDocument();
  });

  test('renders body weight chart label in stones for UK imperial units', async () => {
    render(
      <DashboardAnalyticsWidget
        analytics={{
          goalCompliance: [],
          wellbeing: [],
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
        unitSystem='imperial_uk'
      />,
    );

    const showAllButton = screen.queryByRole('button', { name: 'Show all' });

    if (showAllButton) {
      fireEvent.click(showAllButton);
    }

    expect(await screen.findByText('Body weight (st)')).toBeInTheDocument();
  });

  test('renders clearer empty-state messages for missing and insufficient analytics data', async () => {
    render(
      <DashboardAnalyticsWidget
        analytics={{
          goalCompliance: [],
          wellbeing: [
            {
              label: '03/21',
              mood: 4,
              energy: null,
              stress: null,
              recovery: null,
            },
          ],
          bodyMetrics: [
            {
              label: '03/21',
              bodyWeightKg: 81.5,
              restingHeartRate: null,
            },
          ],
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

    const showAllButton = screen.queryByRole('button', { name: 'Show all' });

    if (showAllButton) {
      fireEvent.click(showAllButton);
    }

    expect(
      screen.getAllByText('Start with your first entry.').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('Not enough data to show a trend yet.').length,
    ).toBeGreaterThan(0);
  });
});
