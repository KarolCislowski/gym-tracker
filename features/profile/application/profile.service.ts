import { updateProfileSchema } from '../domain/profile.validation';
import type { UpdateProfileInput } from '../domain/profile.types';
import { updateTenantProfileRecord } from '../infrastructure/profile.db';

/**
 * Updates the signed-in user's tenant profile.
 * @param input - Profile values submitted by the authenticated user.
 * @returns A promise that resolves when the tenant profile has been updated.
 * @remarks Optional profile fields are normalized by the action layer before validation reaches this service.
 */
export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  const parsedInput = updateProfileSchema.parse(input);

  await updateTenantProfileRecord(parsedInput);
}
