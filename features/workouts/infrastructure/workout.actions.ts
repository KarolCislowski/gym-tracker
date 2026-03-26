'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';

import {
  deleteWorkoutSession,
  createWorkoutSession,
  createWorkoutTemplate,
  deleteWorkoutTemplate,
  getWorkoutSessionDetails,
  getWorkoutTemplateDetails,
  updateWorkoutTemplate,
  updateWorkoutSession,
} from '../application/workout.service';
import type {
  CreateWorkoutSessionInput,
  CreateWorkoutTemplateInput,
  UpdateWorkoutTemplateInput,
  UpdateWorkoutSessionInput,
} from '../domain/workout.types';

/**
 * Persists a structured workout report submitted from the mobile-friendly builder UI.
 * @param formData - Submitted form data containing a serialized workout payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function createWorkoutReportAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const payload = String(formData.get('reportPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      CreateWorkoutSessionInput,
      'tenantDbName' | 'userId' | 'locationSnapshot'
    >;
    const userSnapshot = await getAuthenticatedUserSnapshot(
      session.user.tenantDbName,
      session.user.id,
    );

    await createWorkoutSession({
      ...normalizeWorkoutPayload(parsedPayload),
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      locationSnapshot: userSnapshot.profile?.location ?? null,
    });
  } catch (error) {
    redirect(
      `/workouts?error=${encodeURIComponent(getWorkoutErrorCode(error, 'WORKOUT_REPORT_ERROR_GENERIC'))}`,
    );
  }

  redirect('/workouts?status=workout-report-created');
}

/**
 * Persists a reusable workout template submitted from the mobile-friendly builder UI.
 * @param formData - Submitted form data containing a serialized workout-template payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function createWorkoutTemplateAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const payload = String(formData.get('templatePayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      CreateWorkoutTemplateInput,
      'tenantDbName' | 'userId'
    >;

    await createWorkoutTemplate({
      ...parsedPayload,
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
    });
  } catch (error) {
    redirect(
      `/workouts?error=${encodeURIComponent(getWorkoutErrorCode(error, 'WORKOUT_TEMPLATE_ERROR_GENERIC'))}`,
    );
  }

  redirect('/workouts?status=workout-template-created');
}

export async function updateWorkoutReportAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const reportId = String(formData.get('reportId') ?? '').trim();
  const payload = String(formData.get('reportPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      UpdateWorkoutSessionInput,
      'tenantDbName' | 'userId' | 'reportId' | 'locationSnapshot'
    >;
    const [existingReport, userSnapshot] = await Promise.all([
      getWorkoutSessionDetails(
        session.user.tenantDbName,
        session.user.id,
        reportId,
      ),
      getAuthenticatedUserSnapshot(session.user.tenantDbName, session.user.id),
    ]);

    if (!existingReport) {
      throw new Error('WORKOUT_REPORT_NOT_FOUND');
    }

    await updateWorkoutSession({
      ...normalizeWorkoutPayload(parsedPayload),
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      reportId,
      locationSnapshot: userSnapshot.profile?.location ?? existingReport.locationSnapshot,
    });
  } catch (error) {
    redirect(
      `/workouts/${encodeURIComponent(reportId)}?error=${encodeURIComponent(getWorkoutErrorCode(error, 'WORKOUT_REPORT_ERROR_GENERIC'))}`,
    );
  }

  redirect(`/workouts/${encodeURIComponent(reportId)}?status=workout-report-updated`);
}

/**
 * Deletes a workout report owned by the authenticated user.
 * @param formData - Submitted form data containing the report identifier.
 * @returns A promise that resolves only through redirect handling.
 */
export async function deleteWorkoutReportAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const reportId = String(formData.get('reportId') ?? '').trim();

  try {
    await deleteWorkoutSession(
      session.user.tenantDbName,
      session.user.id,
      reportId,
    );
  } catch (error) {
    redirect(
      `/workouts?error=${encodeURIComponent(getWorkoutErrorCode(error, 'WORKOUT_REPORT_ERROR_GENERIC'))}`,
    );
  }

  redirect('/workouts?status=workout-report-deleted');
}

/**
 * Updates an existing workout template for the authenticated user.
 * @param formData - Submitted form data containing the template identifier and serialized payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function updateWorkoutTemplateAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const templateId = String(formData.get('templateId') ?? '').trim();
  const payload = String(formData.get('templatePayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      UpdateWorkoutTemplateInput,
      'tenantDbName' | 'userId' | 'templateId'
    >;
    const existingTemplate = await getWorkoutTemplateDetails(
      session.user.tenantDbName,
      session.user.id,
      templateId,
    );

    if (!existingTemplate) {
      throw new Error('WORKOUT_TEMPLATE_NOT_FOUND');
    }

    await updateWorkoutTemplate({
      ...parsedPayload,
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      templateId,
    });
  } catch (error) {
    redirect(
      `/workouts/templates/${encodeURIComponent(templateId)}?error=${encodeURIComponent(getWorkoutErrorCode(error, 'WORKOUT_TEMPLATE_ERROR_GENERIC'))}`,
    );
  }

  redirect(
    `/workouts/templates/${encodeURIComponent(templateId)}?status=workout-template-updated`,
  );
}

/**
 * Deletes a workout template owned by the authenticated user.
 * @param formData - Submitted form data containing the template identifier.
 * @returns A promise that resolves only through redirect handling.
 */
export async function deleteWorkoutTemplateAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const templateId = String(formData.get('templateId') ?? '').trim();

  try {
    await deleteWorkoutTemplate(
      session.user.tenantDbName,
      session.user.id,
      templateId,
    );
  } catch (error) {
    redirect(
      `/workouts?error=${encodeURIComponent(getWorkoutErrorCode(error, 'WORKOUT_TEMPLATE_ERROR_GENERIC'))}`,
    );
  }

  redirect('/workouts?status=workout-template-deleted');
}

function getWorkoutErrorCode(error: unknown, fallbackCode: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackCode;
}

function normalizeWorkoutPayload(
  input: Omit<CreateWorkoutSessionInput, 'tenantDbName' | 'userId' | 'locationSnapshot'>,
): Omit<CreateWorkoutSessionInput, 'tenantDbName' | 'userId' | 'locationSnapshot'> {
  return {
    ...input,
    performedAt: new Date(input.performedAt),
    startedAt: input.startedAt ? new Date(input.startedAt) : null,
    endedAt: input.endedAt ? new Date(input.endedAt) : null,
    weatherSnapshot: input.weatherSnapshot
      ? {
          ...input.weatherSnapshot,
          capturedAt: new Date(input.weatherSnapshot.capturedAt),
        }
      : null,
    blocks: input.blocks.map((block) => ({
      ...block,
      entries: block.entries.map((entry) => ({
        ...entry,
        sets: entry.sets.map((set) => ({
          ...set,
          completedAt: set.completedAt ? new Date(set.completedAt) : null,
        })),
      })),
    })),
  };
}
