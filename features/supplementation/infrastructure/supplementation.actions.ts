'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import {
  createSupplementIntakeReport,
  createSupplementStack,
} from '../application/supplementation.service';
import type {
  CreateSupplementIntakeReportInput,
  CreateSupplementStackInput,
} from '../domain/supplementation.types';

/**
 * Persists a reusable supplement stack created by the authenticated user.
 * @param formData - Submitted form data containing a serialized stack payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function createSupplementStackAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const payload = String(formData.get('stackPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      CreateSupplementStackInput,
      'tenantDbName' | 'userId'
    >;

    await createSupplementStack({
      ...parsedPayload,
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
    });
  } catch (error) {
    redirect(
      `/supplementation?error=${encodeURIComponent(getSupplementationErrorCode(error))}`,
    );
  }

  redirect('/supplementation?status=supplement-stack-created');
}

/**
 * Persists a historical supplement-intake report for the authenticated user.
 * @param formData - Submitted form data containing a serialized intake payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function createSupplementIntakeReportAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const payload = String(formData.get('reportPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      CreateSupplementIntakeReportInput,
      'tenantDbName' | 'userId'
    >;

    await createSupplementIntakeReport({
      ...parsedPayload,
      takenAt: new Date(parsedPayload.takenAt),
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
    });
  } catch (error) {
    redirect(
      `/supplementation?error=${encodeURIComponent(getSupplementationErrorCode(error))}`,
    );
  }

  redirect('/supplementation?status=supplement-report-created');
}

function getSupplementationErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'SUPPLEMENTATION_ERROR_GENERIC';
}
