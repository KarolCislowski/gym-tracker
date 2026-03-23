import { describe, expect, test, vi } from 'vitest';

import { createDailyReport, listDailyReports } from './daily-report.service';

vi.mock('../infrastructure/daily-report.db', () => ({
  createTenantDailyReportRecord: vi.fn(),
  listTenantDailyReportRecords: vi.fn(),
}));

import {
  createTenantDailyReportRecord,
  listTenantDailyReportRecords,
} from '../infrastructure/daily-report.db';

const mockedCreateTenantDailyReportRecord = vi.mocked(
  createTenantDailyReportRecord,
);
const mockedListTenantDailyReportRecords = vi.mocked(
  listTenantDailyReportRecords,
);

describe('daily-report.service', () => {
  test('createDailyReport persists a validated daily report payload', async () => {
    const reportDate = new Date('2026-03-22T00:00:00.000Z');

    await createDailyReport({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      reportDate,
      goalsSnapshot: {
        averageSleepHoursPerDay: 8,
        regularSleepSchedule: true,
        stepsPerDay: 10000,
        waterLitersPerDay: 2.5,
        proteinGramsPerDay: 160,
        strengthWorkoutsPerWeek: 4,
        cardioMinutesPerWeek: 120,
      },
      actuals: {
        sleepHours: 7.5,
        sleepScheduleKept: true,
        steps: 11000,
        waterLiters: 2.8,
        proteinGrams: 170,
        strengthWorkoutDone: true,
        cardioMinutes: 30,
      },
      wellbeing: {
        mood: 4,
        energy: 4,
        stress: 2,
        soreness: 3,
        motivation: 5,
        recovery: 4,
      },
      body: {
        bodyWeightKg: 81.2,
        restingHeartRate: 54,
      },
      dayContext: {
        weatherSnapshot: {
          provider: 'open-meteo',
          temperatureC: 6,
          apparentTemperatureC: 4,
          humidityPercent: 72,
          windSpeedKph: 15,
          precipitationMm: 0,
          weatherCode: 'cloudy',
          capturedAt: reportDate,
        },
        menstruationPhase: null,
        illness: false,
        notes: 'Good energy throughout the day.',
      },
      completion: {
        sleepGoalMet: false,
        stepsGoalMet: true,
        waterGoalMet: true,
        proteinGoalMet: true,
        cardioGoalMet: false,
      },
    });

    expect(mockedCreateTenantDailyReportRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantDbName: 'tenant_john',
        userId: 'user-1',
        reportDate,
      }),
    );
  });

  test('listDailyReports delegates to persistence', async () => {
    mockedListTenantDailyReportRecords.mockResolvedValueOnce([
      {
        id: 'daily-1',
        reportDate: '2026-03-22T00:00:00.000Z',
        wellbeing: {
          mood: 4,
          energy: 4,
          stress: 2,
          soreness: 3,
          motivation: 5,
          recovery: 4,
        },
        completion: {
          sleepGoalMet: false,
          stepsGoalMet: true,
          waterGoalMet: true,
          proteinGoalMet: true,
          cardioGoalMet: false,
        },
        actuals: {
          sleepHours: 7.5,
          sleepScheduleKept: true,
          steps: 11000,
          waterLiters: 2.8,
          proteinGrams: 170,
          strengthWorkoutDone: true,
          cardioMinutes: 30,
        },
      },
    ]);

    const result = await listDailyReports('tenant_john', 'user-1');

    expect(mockedListTenantDailyReportRecords).toHaveBeenCalledWith(
      'tenant_john',
      'user-1',
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('daily-1');
  });
});
