'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import {
  createSupplementIntakeReport,
  createSupplementStack,
  deleteSupplementIntakeReport,
  getSupplementIntakeReportDetails,
  updateSupplementIntakeReport,
} from '../application/supplementation.service';
import type {
  CreateSupplementIntakeReportInput,
  CreateSupplementStackInput,
  UpdateSupplementIntakeReportInput,
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
      `/supplementation/reports/${encodeURIComponent(reportId)}?error=${encodeURIComponent(getSupplementationErrorCode(error))}`,
    );
  }

  redirect(
    `/supplementation/reports/${encodeURIComponent(reportId)}?status=supplement-report-updated`,
  );
}

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
      `/supplementation?error=${encodeURIComponent(getSupplementationErrorCode(error))}`,
    );
  }

  redirect('/supplementation?status=supplement-report-deleted');
}

function getSupplementationErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'SUPPLEMENTATION_ERROR_GENERIC';
}
