'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';

import {
  createDailyReport,
  getDailyReportDetails,
  updateDailyReport,
} from '../application/daily-report.service';
import type {
  CreateDailyReportInput,
  UpdateDailyReportInput,
} from '../domain/daily-report.types';

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

/**
 * Updates an existing daily check-in report while preserving its historical goals snapshot.
 * @param formData - Submitted form data containing the report id and serialized payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function updateDailyReportAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const reportId = String(formData.get('reportId') ?? '').trim();
  const payload = String(formData.get('reportPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      UpdateDailyReportInput,
      'tenantDbName' | 'userId' | 'reportId' | 'goalsSnapshot'
    >;
    const [existingReport, userSnapshot] = await Promise.all([
      getDailyReportDetails(
        session.user.tenantDbName,
        session.user.id,
        reportId,
      ),
      getAuthenticatedUserSnapshot(session.user.tenantDbName, session.user.id),
    ]);

    if (!existingReport) {
      throw new Error('DAILY_REPORT_NOT_FOUND');
    }

    const normalizedPayload = normalizeDailyReportPayload(parsedPayload);

    await updateDailyReport({
      ...normalizedPayload,
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      reportId,
      goalsSnapshot: existingReport.goalsSnapshot,
      wellbeing: {
        ...normalizedPayload.wellbeing,
        libido: userSnapshot.settings?.trackLibido
          ? normalizedPayload.wellbeing.libido
          : existingReport.wellbeing.libido,
      },
      dayContext: {
        ...normalizedPayload.dayContext,
        menstruationPhase: userSnapshot.settings?.trackMenstrualCycle
          ? normalizedPayload.dayContext.menstruationPhase
          : existingReport.dayContext.menstruationPhase,
      },
    });
  } catch (error) {
    redirect(
      `/daily-reports/${encodeURIComponent(reportId)}?error=${encodeURIComponent(getDailyReportErrorCode(error))}`,
    );
  }

  redirect(`/daily-reports/${encodeURIComponent(reportId)}?status=daily-report-updated`);
}

function getDailyReportErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'DAILY_REPORT_ERROR_GENERIC';
}

function normalizeDailyReportPayload<T extends {
  reportDate: Date | string;
  actuals: CreateDailyReportInput['actuals'];
  wellbeing: CreateDailyReportInput['wellbeing'];
  body: CreateDailyReportInput['body'];
  dayContext: CreateDailyReportInput['dayContext'];
  completion: CreateDailyReportInput['completion'];
}>(
  input: T,
): T {
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
