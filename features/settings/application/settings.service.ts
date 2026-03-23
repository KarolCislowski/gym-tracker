import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import {
  changePasswordSchema,
  deleteAccountSchema,
  updateTenantSettingsSchema,
} from '../domain/settings.validation';
import {
  deleteCoreUserRecord,
  deleteTenantDatabaseRecord,
  findCoreUserSecurityById,
  updateCoreUserPasswordRecord,
  updateTenantSettingsRecord,
} from '../infrastructure/settings.db';
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  UpdateTenantSettingsInput,
} from '../domain/settings.types';

/**
 * Updates tenant-level settings for the current workspace.
 * @param input - Tenant settings values to persist for the authenticated workspace.
 * @returns A promise that resolves when the tenant settings have been updated.
 * @remarks Input is validated before persistence to ensure language and mode values stay within supported bounds.
 */
export async function updateTenantSettings(
  input: UpdateTenantSettingsInput,
): Promise<void> {
  const {
    tenantDbName,
    language,
    isDarkMode,
    unitSystem,
    trackMenstrualCycle,
    trackLibido,
  } =
    updateTenantSettingsSchema.parse(input);

  await updateTenantSettingsRecord(tenantDbName, {
    language,
    isDarkMode,
    unitSystem,
    trackMenstrualCycle,
    trackLibido,
  });
}

/**
 * Changes the signed-in user's password after verifying the current password.
 * @param input - Password change payload for the authenticated user.
 * @returns A promise that resolves when the password hash has been updated.
 * @remarks Validation failures and security mismatches are surfaced as stable error codes for the UI layer.
 */
export async function changeUserPassword(
  input: ChangePasswordInput,
): Promise<void> {
  let parsedInput: ReturnType<typeof changePasswordSchema.parse>;

  try {
    parsedInput = changePasswordSchema.parse(input);
  } catch (error) {
    if (
      error instanceof ZodError &&
      error.issues.some((issue) => issue.message === 'PASSWORD_CONFIRMATION_MISMATCH')
    ) {
      throw new Error('SETTINGS_ERROR_PASSWORD_CONFIRMATION_MISMATCH');
    }

    throw error;
  }

  const { userId, currentPassword, newPassword } = parsedInput;
  const user = await findCoreUserSecurityById(userId);

  if (!user) {
    throw new Error('SETTINGS_ERROR_GENERIC');
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new Error('SETTINGS_ERROR_INVALID_CURRENT_PASSWORD');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await updateCoreUserPasswordRecord(userId, hashedPassword);
}

/**
 * Deletes the signed-in account after password validation and explicit email confirmation.
 * @param input - Account deletion payload for the authenticated user.
 * @returns A promise that resolves when both the Core user and tenant database have been removed.
 * @remarks This operation is destructive and requires both password verification and email confirmation.
 */
export async function deleteUserAccount(
  input: DeleteAccountInput,
): Promise<void> {
  const { userId, currentPassword, confirmationEmail } =
    deleteAccountSchema.parse(input);
  const user = await findCoreUserSecurityById(userId);

  if (!user) {
    throw new Error('SETTINGS_ERROR_GENERIC');
  }

  if (user.email !== confirmationEmail) {
    throw new Error('SETTINGS_ERROR_CONFIRMATION_EMAIL_MISMATCH');
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new Error('SETTINGS_ERROR_INVALID_CURRENT_PASSWORD');
  }

  await deleteCoreUserRecord(userId);
  await deleteTenantDatabaseRecord(user.tenantDbName);
}
