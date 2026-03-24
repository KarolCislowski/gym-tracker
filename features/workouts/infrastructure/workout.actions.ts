'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';

import {
  createWorkoutSession,
  createWorkoutTemplate,
} from '../application/workout.service';
import type {
  CreateWorkoutSessionInput,
  CreateWorkoutTemplateInput,
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
    redirect(`/workouts?error=${encodeURIComponent(getWorkoutErrorCode(error))}`);
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
    redirect(`/workouts?error=${encodeURIComponent(getWorkoutErrorCode(error))}`);
  }

  redirect('/workouts?status=workout-template-created');
}

function getWorkoutErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'WORKOUT_REPORT_ERROR_GENERIC';
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
