'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import {
  createSupplementIntakeReport,
  createSupplementStack,
  deleteSupplementIntakeReport,
  deleteSupplementStack,
  getSupplementIntakeReportDetails,
  getSupplementStackDetails,
  updateSupplementIntakeReport,
  updateSupplementStack,
} from '../application/supplementation.service';
import type {
  CreateSupplementIntakeReportInput,
  CreateSupplementStackInput,
  UpdateSupplementIntakeReportInput,
  UpdateSupplementStackInput,
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
      `/supplementation?error=${encodeURIComponent(getSupplementationErrorCode(error, 'SUPPLEMENT_STACK_ERROR_GENERIC'))}`,
    );
  }

  redirect('/supplementation?status=supplement-stack-created');
}

/**
 * Updates a saved supplement stack for the authenticated user.
 * @param formData - Submitted form data containing the stack identifier and serialized payload.
 * @returns A promise that resolves only through redirect handling.
 */
export async function updateSupplementStackAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const stackId = String(formData.get('stackId') ?? '').trim();
  const payload = String(formData.get('stackPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      UpdateSupplementStackInput,
      'tenantDbName' | 'userId' | 'stackId'
    >;
    const existingStack = await getSupplementStackDetails(
      session.user.tenantDbName,
      session.user.id,
      stackId,
    );

    if (!existingStack) {
      throw new Error('SUPPLEMENT_STACK_NOT_FOUND');
    }

    await updateSupplementStack({
      ...parsedPayload,
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      stackId,
    });
  } catch (error) {
    redirect(
      `/supplementation/stacks/${encodeURIComponent(stackId)}?error=${encodeURIComponent(getSupplementationErrorCode(error, 'SUPPLEMENT_STACK_ERROR_GENERIC'))}`,
    );
  }

  redirect(
    `/supplementation/stacks/${encodeURIComponent(stackId)}?status=supplement-stack-updated`,
  );
}

/**
 * Deletes a saved supplement stack owned by the authenticated user.
 * @param formData - Submitted form data containing the stack identifier.
 * @returns A promise that resolves only through redirect handling.
 */
export async function deleteSupplementStackAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const stackId = String(formData.get('stackId') ?? '').trim();

  try {
    await deleteSupplementStack(
      session.user.tenantDbName,
      session.user.id,
      stackId,
    );
  } catch (error) {
    redirect(
      `/supplementation?error=${encodeURIComponent(getSupplementationErrorCode(error, 'SUPPLEMENT_STACK_ERROR_GENERIC'))}`,
    );
  }

  redirect('/supplementation?status=supplement-stack-deleted');
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
      `/supplementation?error=${encodeURIComponent(getSupplementationErrorCode(error, 'SUPPLEMENT_REPORT_ERROR_GENERIC'))}`,
    );
  }

  redirect('/supplementation?status=supplement-report-created');
}

export async function updateSupplementIntakeReportAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const reportId = String(formData.get('reportId') ?? '').trim();
  const payload = String(formData.get('reportPayload') ?? '').trim();

  try {
    const parsedPayload = JSON.parse(payload) as Omit<
      UpdateSupplementIntakeReportInput,
      'tenantDbName' | 'userId' | 'reportId'
    >;
    const existingReport = await getSupplementIntakeReportDetails(
      session.user.tenantDbName,
      session.user.id,
      reportId,
    );

    if (!existingReport) {
      throw new Error('SUPPLEMENT_REPORT_NOT_FOUND');
    }

    await updateSupplementIntakeReport({
      ...parsedPayload,
      takenAt: new Date(parsedPayload.takenAt),
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      reportId,
    });
  } catch (error) {
    redirect(
      `/supplementation/reports/${encodeURIComponent(reportId)}?error=${encodeURIComponent(getSupplementationErrorCode(error, 'SUPPLEMENT_REPORT_ERROR_GENERIC'))}`,
    );
  }

  redirect(
    `/supplementation/reports/${encodeURIComponent(reportId)}?status=supplement-report-updated`,
  );
}

/**
 * Deletes a historical supplement-intake report owned by the authenticated user.
 * @param formData - Submitted form data containing the report identifier.
 * @returns A promise that resolves only through redirect handling.
 */
export async function deleteSupplementIntakeReportAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const reportId = String(formData.get('reportId') ?? '').trim();

  try {
    await deleteSupplementIntakeReport(
      session.user.tenantDbName,
      session.user.id,
      reportId,
    );
  } catch (error) {
    redirect(
      `/supplementation?error=${encodeURIComponent(getSupplementationErrorCode(error, 'SUPPLEMENT_REPORT_ERROR_GENERIC'))}`,
    );
  }

  redirect('/supplementation?status=supplement-report-deleted');
}

function getSupplementationErrorCode(error: unknown, fallbackCode: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackCode;
}
