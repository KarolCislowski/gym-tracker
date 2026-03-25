import { createWorkoutSessionSchema } from '../domain/workout.validation';
import type {
  CreateWorkoutTemplateInput,
  CreateWorkoutSessionInput,
  UpdateWorkoutTemplateInput,
  UpdateWorkoutSessionInput,
  WorkoutSessionDetails,
  WorkoutTemplateSummary,
  WorkoutSessionAnalytics,
  WorkoutSessionSummary,
} from '../domain/workout.types';
import {
  createTenantWorkoutTemplateRecord,
  createTenantWorkoutSessionRecord,
  deleteTenantWorkoutSessionRecord,
  deleteTenantWorkoutTemplateRecord,
  findTenantWorkoutTemplateRecordById,
  findTenantWorkoutSessionRecordById,
  listTenantWorkoutTemplateRecords,
  listTenantWorkoutSessionAnalyticsRecords,
  listTenantWorkoutSessionRecords,
  updateTenantWorkoutTemplateRecord,
  updateTenantWorkoutSessionRecord,
} from '../infrastructure/workout.db';
import {
  createWorkoutTemplateSchema,
  updateWorkoutTemplateSchema,
  updateWorkoutSessionSchema,
} from '../domain/workout.validation';

/**
 * Persists a workout session with the performed exercise entries and sets.
 * @param input - Tenant-scoped workout session submitted by the user.
 * @returns A promise that resolves when the workout session has been stored.
 */
export async function createWorkoutSession(
  input: CreateWorkoutSessionInput,
): Promise<void> {
  createWorkoutSessionSchema.parse(input);

  await createTenantWorkoutSessionRecord(input);
}

export async function getWorkoutSessionDetails(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<WorkoutSessionDetails | null> {
  return findTenantWorkoutSessionRecordById(tenantDbName, userId, reportId);
}

export async function updateWorkoutSession(
  input: UpdateWorkoutSessionInput,
): Promise<void> {
  updateWorkoutSessionSchema.parse(input);

  await updateTenantWorkoutSessionRecord(input);
}

export async function deleteWorkoutSession(
  tenantDbName: string,
  userId: string,
  reportId: string,
): Promise<void> {
  await deleteTenantWorkoutSessionRecord(tenantDbName, userId, reportId);
}

/**
 * Persists a reusable workout template with predefined blocks and exercise selections.
 * @param input - Tenant-scoped workout template submitted by the user.
 * @returns A promise that resolves when the workout template has been stored.
 */
export async function createWorkoutTemplate(
  input: CreateWorkoutTemplateInput,
): Promise<void> {
  createWorkoutTemplateSchema.parse(input);

  await createTenantWorkoutTemplateRecord(input);
}

export async function getWorkoutTemplateDetails(
  tenantDbName: string,
  userId: string,
  templateId: string,
): Promise<WorkoutTemplateSummary | null> {
  return findTenantWorkoutTemplateRecordById(tenantDbName, userId, templateId);
}

export async function updateWorkoutTemplate(
  input: UpdateWorkoutTemplateInput,
): Promise<void> {
  updateWorkoutTemplateSchema.parse(input);

  await updateTenantWorkoutTemplateRecord(input);
}

export async function deleteWorkoutTemplate(
  tenantDbName: string,
  userId: string,
  templateId: string,
): Promise<void> {
  await deleteTenantWorkoutTemplateRecord(tenantDbName, userId, templateId);
}

/**
 * Lists workout session summaries for the authenticated tenant user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to reverse-chronological workout session summaries.
 */
export async function listWorkoutSessions(
  tenantDbName: string,
  userId: string,
): Promise<WorkoutSessionSummary[]> {
  return listTenantWorkoutSessionRecords(tenantDbName, userId);
}

/**
 * Lists workout templates for the authenticated tenant user.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to reusable workout templates.
 */
export async function listWorkoutTemplates(
  tenantDbName: string,
  userId: string,
): Promise<WorkoutTemplateSummary[]> {
  return listTenantWorkoutTemplateRecords(tenantDbName, userId);
}

/**
 * Lists workout sessions normalized for analytics computations.
 * @param tenantDbName - Tenant database name.
 * @param userId - Authenticated user identifier.
 * @returns A promise resolving to workout sessions with entry-level set counts.
 */
export async function listWorkoutSessionsForAnalytics(
  tenantDbName: string,
  userId: string,
): Promise<WorkoutSessionAnalytics[]> {
  return listTenantWorkoutSessionAnalyticsRecords(tenantDbName, userId);
}
