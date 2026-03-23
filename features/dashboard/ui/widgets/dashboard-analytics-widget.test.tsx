/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
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
        }}
        translations={enMessages}
        unitSystem='metric'
      />,
    );

    expect(
      screen.getByRole('table', { name: 'Goal compliance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Sleep goal, 03/21: Yes'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Steps per day, 03/21: No'),
    ).toBeInTheDocument();
  });

  test('renders body weight chart label in imperial units when requested', () => {
    render(
      <DashboardAnalyticsWidget
        analytics={{
          goalCompliance: [],
          wellbeing: [],
          bodyMetrics: [
            {
              label: '03/21',
              bodyWeightKg: 81.5,
              restingHeartRate: 54,
            },
          ],
          workoutVolume: [],
          workoutVolumeMuscleGroups: [],
          workoutVolumeMuscleGroupLabels: {},
        }}
        translations={enMessages}
        unitSystem='imperial_us'
      />,
    );

    expect(screen.getByText('Body weight (lb)')).toBeInTheDocument();
  });

  test('renders body weight chart label in stones for UK imperial units', () => {
    render(
      <DashboardAnalyticsWidget
        analytics={{
          goalCompliance: [],
          wellbeing: [],
          bodyMetrics: [
            {
              label: '03/21',
              bodyWeightKg: 81.5,
              restingHeartRate: 54,
            },
          ],
          workoutVolume: [],
          workoutVolumeMuscleGroups: [],
          workoutVolumeMuscleGroupLabels: {},
        }}
        translations={enMessages}
        unitSystem='imperial_uk'
      />,
    );

    expect(screen.getByText('Body weight (st)')).toBeInTheDocument();
  });
});
