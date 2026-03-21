import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('../application/healthy-habits.service', () => ({
  updateHealthyHabits: vi.fn(),
}));

import { auth } from '@/auth';

import { updateHealthyHabits } from '../application/healthy-habits.service';
import { updateHealthyHabitsAction } from './healthy-habits.actions';

const mockedAuth = vi.mocked(auth);
const mockedUpdateHealthyHabits = vi.mocked(updateHealthyHabits);

function createFormData(entries: Record<string, string | boolean>): FormData {
  const formData = new FormData();

  Object.entries(entries).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      if (value) {
        formData.set(key, 'on');
      }

      return;
    }

    formData.set(key, value);
  });

  return formData;
}

describe('healthy-habits.actions', () => {
  /**
   * Resets mock state before each action scenario.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAuth.mockResolvedValue({
      user: {
        tenantDbName: 'tenant_john',
      },
    } as unknown as Awaited<ReturnType<typeof auth>>);
  });

  /**
   * Verifies that healthy habits form values are normalized and forwarded to the service.
   */
  test('updateHealthyHabitsAction sends healthy habits values to the service', async () => {
    await expect(
      updateHealthyHabitsAction(
        createFormData({
          unitSystem: 'imperial_us',
          averageSleepHoursPerDay: '7.5',
          stepsPerDay: '9000',
          waterFluidOuncesPerDay: '67.6',
          proteinGramsPerDay: '150',
          strengthWorkoutsPerWeek: '3',
          cardioMinutesPerWeek: '120',
        }),
      ),
    ).rejects.toThrow(
      'NEXT_REDIRECT:/profile?section=healthy-habits&status=healthy-habits-updated',
    );

    expect(mockedUpdateHealthyHabits).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      unitSystem: 'imperial_us',
      averageSleepHoursPerDay: 7.5,
      stepsPerDay: 9000,
      waterLitersPerDay: null,
      waterFluidOuncesPerDay: 67.6,
      proteinGramsPerDay: 150,
      strengthWorkoutsPerWeek: 3,
      cardioMinutesPerWeek: 120,
    });
  });
});
