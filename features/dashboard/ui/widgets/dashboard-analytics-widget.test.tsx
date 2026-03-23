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
});
