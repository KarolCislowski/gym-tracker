'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import { updateHealthyHabits } from '../application/healthy-habits.service';

/**
 * Persists changes to the authenticated user's healthy habits goals.
 * @param formData - Submitted form data containing healthy habits values.
 * @returns A promise that resolves only through redirect handling.
 * @remarks The action redirects back to the profile page with either a success status or an error code.
 */
export async function updateHealthyHabitsAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.tenantDbName) {
    redirect('/login');
  }

  try {
    await updateHealthyHabits({
      tenantDbName: session.user.tenantDbName,
      unitSystem: normalizeUnitSystem(formData.get('unitSystem')),
      averageSleepHoursPerDay: normalizeOptionalNumber(
        formData.get('averageSleepHoursPerDay'),
      ),
      regularSleepSchedule: normalizeCheckboxValues(
        formData.getAll('regularSleepSchedule'),
      ),
      stepsPerDay: normalizeOptionalNumber(formData.get('stepsPerDay')),
      waterLitersPerDay: normalizeOptionalNumber(formData.get('waterLitersPerDay')),
      waterFluidOuncesPerDay: normalizeOptionalNumber(
        formData.get('waterFluidOuncesPerDay'),
      ),
      carbsGramsPerDay: normalizeOptionalNumber(formData.get('carbsGramsPerDay')),
      proteinGramsPerDay: normalizeOptionalNumber(formData.get('proteinGramsPerDay')),
      fatGramsPerDay: normalizeOptionalNumber(formData.get('fatGramsPerDay')),
      strengthWorkoutsPerWeek: normalizeOptionalNumber(
        formData.get('strengthWorkoutsPerWeek'),
      ),
      cardioMinutesPerWeek: normalizeOptionalNumber(
        formData.get('cardioMinutesPerWeek'),
      ),
    });
  } catch (error) {
    redirect(
      `/profile?section=healthy-habits&error=${encodeURIComponent(
        getHealthyHabitsErrorCode(error),
      )}`,
    );
  }

  redirect('/profile?section=healthy-habits&status=healthy-habits-updated');
}

function normalizeOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) {
    return null;
  }

  return Number(normalizedValue);
}

function normalizeUnitSystem(
  value: FormDataEntryValue | null,
): 'metric' | 'imperial_us' | 'imperial_uk' {
  const normalizedValue = String(value ?? 'metric').trim();

  return normalizedValue === 'imperial_us' || normalizedValue === 'imperial_uk'
    ? normalizedValue
    : 'metric';
}

function normalizeCheckboxValues(values: FormDataEntryValue[]): boolean {
  return values.some((value) => {
    const normalizedValue = String(value).trim();

    return normalizedValue === 'true' || normalizedValue === 'on';
  });
}

function getHealthyHabitsErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'HEALTHY_HABITS_ERROR_GENERIC';
}
