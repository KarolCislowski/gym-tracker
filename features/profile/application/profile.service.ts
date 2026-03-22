import { updateProfileSchema } from '../domain/profile.validation';
import type { UpdateProfileInput } from '../domain/profile.types';
import { updateTenantProfileRecord } from '../infrastructure/profile.db';
import { convertHeightToMetric } from '@/shared/units/application/unit-conversion';

/**
 * Updates the signed-in user's tenant profile.
 * @param input - Profile values submitted by the authenticated user.
 * @returns A promise that resolves when the tenant profile has been updated.
 * @remarks Optional profile fields are normalized by the action layer before validation reaches this service.
 */
export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  const parsedInput = updateProfileSchema.parse({
    tenantDbName: input.tenantDbName,
    userId: input.userId,
    firstName: input.firstName,
    lastName: input.lastName,
    birthDate: input.birthDate,
    heightCm: resolveHeightInMetric(input),
    gender: input.gender,
    activityLevel: input.activityLevel,
  });

  await updateTenantProfileRecord(parsedInput);
}

function resolveHeightInMetric(input: UpdateProfileInput): number | null {
  if (input.unitSystem === 'metric') {
    return input.heightCm;
  }

  if (input.heightFeet == null && input.heightInches == null) {
    return null;
  }

  return convertHeightToMetric({
    system: input.unitSystem,
    feet: input.heightFeet ?? 0,
    inches: input.heightInches ?? 0,
  });
}
