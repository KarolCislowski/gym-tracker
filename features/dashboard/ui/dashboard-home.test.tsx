/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { resolveDashboardLayout } from '../application/dashboard-layout.service';
import { resolveDashboardNextAction } from '../application/dashboard-next-action';
import { DashboardHome } from './dashboard-home';

vi.mock('./dashboard-layout-customizer', () => ({
  DashboardLayoutCustomizer: () => <button type='button'>Customize dashboard</button>,
}));

describe('DashboardHome', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-22T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Verifies that the dashboard overview renders tenant profile and settings content.
   */
  test('renders the dashboard overview content', () => {
    render(
      <DashboardHome
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
              label: '03/21',
              mood: 4,
              energy: 4,
              stress: 2,
              recovery: 4,
            },
          ],
          bodyMetrics: [
            {
              label: '03/21',
              bodyWeightKg: 81.5,
              restingHeartRate: 54,
            },
          ],
          workoutVolume: [
            {
              label: '2026-W12',
              pectorals: 8,
              lats: 6,
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
        dailyReports={[
          {
            id: 'daily-report-1',
            reportDate: '2026-03-21T00:00:00.000Z',
            actuals: {
              sleepHours: 7.5,
              sleepScheduleKept: true,
              steps: 9000,
              waterLiters: 2,
              proteinGrams: 150,
              strengthWorkoutDone: true,
              cardioMinutes: 15,
            },
            body: {
              bodyWeightKg: 81.5,
              restingHeartRate: 54,
            },
            completion: {
              sleepGoalMet: true,
              stepsGoalMet: true,
              waterGoalMet: true,
              proteinGoalMet: true,
              cardioGoalMet: false,
            },
            wellbeing: {
              mood: 4,
              energy: 4,
              stress: 2,
              soreness: 2,
              libido: null,
              motivation: 4,
              recovery: 4,
            },
          },
        ]}
        dailyReportCount={1}
        layout={resolveDashboardLayout([])}
        favoriteExercises={[
          {
            id: 'exercise-1',
            name: 'Bench Press',
            slug: 'bench-press',
            type: 'compound',
            movementPattern: 'push',
            difficulty: 'beginner',
            muscles: [
              {
                muscleGroupId: 'pectorals',
                role: 'primary',
                activationLevel: 0.95,
              },
            ],
            variants: [
              {
                id: 'variant-1',
                name: 'Barbell Bench Press',
                slug: 'barbell-bench-press',
                equipment: ['barbell', 'bench'],
                trackableMetrics: ['weight', 'reps'],
              },
            ],
            isActive: true,
          },
        ]}
        nextAction={resolveDashboardNextAction({
          dailyReports: [],
          userSnapshot: {
            profile: {
              email: 'john@example.com',
              firstName: 'John',
              lastName: 'Doe',
              birthDate: '1995-03-22T00:00:00.000Z',
              age: 31,
              favoriteExerciseSlugs: [],
              location: {
                provider: 'google_places',
                placeId: 'place-1',
                displayName: 'Stockholm',
                formattedAddress: 'Stockholm, Sweden',
                latitude: 59.3293,
                longitude: 18.0686,
                countryCode: 'SE',
                country: 'Sweden',
                region: 'Stockholm County',
                city: 'Stockholm',
                locality: null,
                postalCode: null,
              },
              heightCm: 180,
              gender: 'male',
              activityLevel: 'moderately_active',
            },
            settings: {
              language: 'sv',
              isDarkMode: true,
              unitSystem: 'imperial_uk',
              trackMenstrualCycle: false,
              trackLibido: false,
            },
            healthyHabits: {
              averageSleepHoursPerDay: 7.5,
              stepsPerDay: 9000,
              waterLitersPerDay: 2,
              proteinGramsPerDay: 150,
              strengthWorkoutsPerWeek: 3,
              cardioMinutesPerWeek: 120,
              regularSleepSchedule: true,
            },
            favoriteExerciseSlugs: [],
          },
          workoutSessions: [],
        })}
        translations={enMessages}
        userSnapshot={{
          profile: {
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1995-03-22T00:00:00.000Z',
            age: 31,
            favoriteExerciseSlugs: [],
            location: {
              provider: 'google_places',
              placeId: 'place-1',
              displayName: 'Stockholm',
              formattedAddress: 'Stockholm, Sweden',
              latitude: 59.3293,
              longitude: 18.0686,
              countryCode: 'SE',
              country: 'Sweden',
              region: 'Stockholm County',
              city: 'Stockholm',
              locality: null,
              postalCode: null,
            },
            heightCm: 180,
            gender: 'male',
            activityLevel: 'moderately_active',
          },
          settings: {
            language: 'sv',
            isDarkMode: true,
            unitSystem: 'imperial_uk',
            trackMenstrualCycle: false,
            trackLibido: false,
          },
          healthyHabits: {
            averageSleepHoursPerDay: 7.5,
            stepsPerDay: 9000,
            waterLitersPerDay: 2,
            proteinGramsPerDay: 150,
            strengthWorkoutsPerWeek: 3,
            cardioMinutesPerWeek: 120,
            regularSleepSchedule: true,
          },
          favoriteExerciseSlugs: [],
        }}
        workoutSessions={[
          {
            id: 'workout-1',
            workoutName: 'Upper body',
            performedAt: '2026-03-21T16:00:00.000Z',
            durationMinutes: 75,
            notes: null,
            blockCount: 2,
            exerciseCount: 6,
            setCount: 18,
          },
        ]}
        workoutReportCount={1}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Welcome back' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Customize dashboard' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Next action' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Add daily report' }),
    ).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Stockholm, Sweden')).toBeInTheDocument();
    expect(screen.getAllByText('31').length).toBeGreaterThan(0);
    expect(screen.getByText('5 ft 11 in')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Moderately active')).toBeInTheDocument();
    expect(screen.getByText('sv')).toBeInTheDocument();
    expect(screen.getByText('Imperial (UK)')).toBeInTheDocument();
    expect(screen.getByText('9000')).toBeInTheDocument();
    expect(screen.getByText('7.5 h')).toBeInTheDocument();
    expect(screen.getAllByText('Yes').length).toBeGreaterThan(0);
    expect(screen.getByText('70.4 fl oz')).toBeInTheDocument();
    expect(screen.getByText('150 g')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My favorite exercises' })).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View details: Bench Press' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Activity calendar' })).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Go to profile' }),
    ).toHaveLength(2);
  });
});
