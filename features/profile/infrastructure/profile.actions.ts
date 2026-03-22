'use server';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import { updateProfile } from '../application/profile.service';

/**
 * Persists changes to the authenticated user's tenant profile.
 * @param formData - Submitted form data containing profile values.
 * @returns A promise that resolves only through redirect handling.
 * @remarks The action redirects back to the profile page with either a success status or an error code.
 */
export async function updateProfileAction(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  try {
    await updateProfile({
      tenantDbName: session.user.tenantDbName,
      userId: session.user.id,
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      birthDate: normalizeOptionalDate(formData.get('birthDate')),
      location: normalizeLocation(formData),
      unitSystem: normalizeUnitSystem(formData.get('unitSystem')),
      heightCm: normalizeOptionalNumber(formData.get('heightCm')),
      heightFeet: normalizeOptionalNumber(formData.get('heightFeet')),
      heightInches: normalizeOptionalNumber(formData.get('heightInches')),
      gender: normalizeOptionalEnum(
        formData.get('gender'),
      ) as
        | 'female'
        | 'male'
        | 'other'
        | 'prefer_not_to_say'
        | null,
      activityLevel: normalizeOptionalEnum(
        formData.get('activityLevel'),
      ) as
        | 'sedentary'
        | 'lightly_active'
        | 'moderately_active'
        | 'very_active'
        | 'extra_active'
        | null,
    });
  } catch (error) {
    redirect(
      `/profile?section=profile&error=${encodeURIComponent(getProfileErrorCode(error))}`,
    );
  }

  redirect('/profile?section=profile&status=profile-updated');
}

function normalizeUnitSystem(
  value: FormDataEntryValue | null,
): 'metric' | 'imperial_us' | 'imperial_uk' {
  const normalizedValue = String(value ?? 'metric').trim();

  return normalizedValue === 'imperial_us' || normalizedValue === 'imperial_uk'
    ? normalizedValue
    : 'metric';
}

function normalizeOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) {
    return null;
  }

  return Number(normalizedValue);
}

function normalizeOptionalDate(value: FormDataEntryValue | null): Date | null {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) {
    return null;
  }

  return new Date(`${normalizedValue}T00:00:00.000Z`);
}

function normalizeOptionalEnum(value: FormDataEntryValue | null): string | null {
  if (!value) {
    return null;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue ? normalizedValue : null;
}

function normalizeLocation(
  formData: FormData,
):
  | {
      provider: 'google_places';
      placeId: string;
      displayName: string;
      formattedAddress: string;
      latitude: number;
      longitude: number;
      countryCode: string | null;
      country: string | null;
      region: string | null;
      city: string | null;
      locality: string | null;
      postalCode: string | null;
    }
  | null {
  const placeId = String(formData.get('locationPlaceId') ?? '').trim();

  if (!placeId) {
    return null;
  }

  return {
    provider: 'google_places',
    placeId,
    displayName: String(formData.get('locationDisplayName') ?? '').trim(),
    formattedAddress: String(
      formData.get('locationFormattedAddress') ?? '',
    ).trim(),
    latitude: Number(formData.get('locationLatitude') ?? ''),
    longitude: Number(formData.get('locationLongitude') ?? ''),
    countryCode: normalizeOptionalString(formData.get('locationCountryCode')),
    country: normalizeOptionalString(formData.get('locationCountry')),
    region: normalizeOptionalString(formData.get('locationRegion')),
    city: normalizeOptionalString(formData.get('locationCity')),
    locality: normalizeOptionalString(formData.get('locationLocality')),
    postalCode: normalizeOptionalString(formData.get('locationPostalCode')),
  };
}

function normalizeOptionalString(value: FormDataEntryValue | null): string | null {
  const normalizedValue = String(value ?? '').trim();

  return normalizedValue || null;
}

function getProfileErrorCode(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'PROFILE_ERROR_GENERIC';
}
