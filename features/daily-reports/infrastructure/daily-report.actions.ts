'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';

import { createDailyReport } from '../application/daily-report.service';
import type { CreateDailyReportInput } from '../domain/daily-report.types';

/**
 * Persists a daily check-in report and snapshots the user's current healthy-habits goals.
 * @param formData - Submitted form data containing a serialized daily report payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function createDailyReportAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const payload = String(formData.get('reportPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      CreateDailyReportInput,
      'tenantDbName' | 'userId' | 'goalsSnapshot'
    >;
    const userSnapshot = await getAuthenticatedUserSnapshot(
      session.user.tenantDbName,
      session.user.id,
    );

    await createDailyReport({
      ...normalizeDailyReportPayload(parsedPayload),
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      goalsSnapshot: {
        averageSleepHoursPerDay:
          userSnapshot.healthyHabits?.averageSleepHoursPerDay ?? null,
        regularSleepSchedule:
          userSnapshot.healthyHabits?.regularSleepSchedule ?? null,
        stepsPerDay: userSnapshot.healthyHabits?.stepsPerDay ?? null,
        waterLitersPerDay: userSnapshot.healthyHabits?.waterLitersPerDay ?? null,
        proteinGramsPerDay:
          userSnapshot.healthyHabits?.proteinGramsPerDay ?? null,
        strengthWorkoutsPerWeek:
          userSnapshot.healthyHabits?.strengthWorkoutsPerWeek ?? null,
        cardioMinutesPerWeek:
          userSnapshot.healthyHabits?.cardioMinutesPerWeek ?? null,
      },
    });
  } catch (error) {
    redirect(`/daily-reports?error=${encodeURIComponent(getDailyReportErrorCode(error))}`);
  }

  redirect('/daily-reports?status=daily-report-created');
}

function getDailyReportErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'DAILY_REPORT_ERROR_GENERIC';
}

function normalizeDailyReportPayload(
  input: Omit<CreateDailyReportInput, 'tenantDbName' | 'userId' | 'goalsSnapshot'>,
): Omit<CreateDailyReportInput, 'tenantDbName' | 'userId' | 'goalsSnapshot'> {
  return {
    ...input,
    reportDate: new Date(input.reportDate),
    dayContext: {
      ...input.dayContext,
      weatherSnapshot: input.dayContext.weatherSnapshot
        ? {
            ...input.dayContext.weatherSnapshot,
            capturedAt: new Date(input.dayContext.weatherSnapshot.capturedAt),
          }
        : null,
    },
  };
}
