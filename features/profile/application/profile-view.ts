import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { convertHeightFromMetric } from '@/shared/units/application/unit-conversion';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

type ProfileTranslations = TranslationDictionary['profile'];
type ProfileSnapshot = NonNullable<AuthenticatedUserSnapshot['profile']>;
type ProfileGender = ProfileSnapshot['gender'];
type ProfileActivityLevel = ProfileSnapshot['activityLevel'];
type ProfileHeight = ProfileSnapshot['heightCm'];
type ProfileBirthDate = ProfileSnapshot['birthDate'];

/**
 * Resolves the localized label for a biological sex value.
 * @param translations - The localized profile translation subset.
 * @param value - The stored biological sex value.
 * @returns The localized label or the empty-state label when no value is set.
 */
export function getProfileSexLabel(
  translations: ProfileTranslations,
  value: ProfileGender,
): string {
  switch (value) {
    case 'female':
      return translations.sexFemale;
    case 'male':
      return translations.sexMale;
    case 'other':
      return translations.sexOther;
    case 'prefer_not_to_say':
      return translations.sexPreferNotToSay;
    default:
      return translations.emptyValue;
  }
}

/**
 * Resolves the localized label for an activity level value.
 * @param translations - The localized profile translation subset.
 * @param value - The stored activity level value.
 * @returns The localized label or the empty-state label when no value is set.
 */
export function getProfileActivityLabel(
  translations: ProfileTranslations,
  value: ProfileActivityLevel,
): string {
  switch (value) {
    case 'sedentary':
      return translations.activitySedentary;
    case 'lightly_active':
      return translations.activityLightlyActive;
    case 'moderately_active':
      return translations.activityModeratelyActive;
    case 'very_active':
      return translations.activityVeryActive;
    case 'extra_active':
      return translations.activityExtraActive;
    default:
      return translations.emptyValue;
  }
}

/**
 * Formats profile height using the active measurement system.
 * @param translations - The localized profile translation subset.
 * @param value - Height stored in metric centimeters.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns The formatted height value or the empty-state label when no value is set.
 */
export function getProfileHeightLabel(
  translations: ProfileTranslations,
  value: ProfileHeight,
  unitSystem: UnitSystem,
): string {
  if (value == null) {
    return translations.emptyValue;
  }

  const convertedValue = convertHeightFromMetric(value, unitSystem);

  if (convertedValue.system === 'metric') {
    return `${convertedValue.value} cm`;
  }

  return `${convertedValue.feet} ft ${convertedValue.inches} in`;
}

/**
 * Calculates the full age in years from a stored birth date.
 * @param birthDate - Birth date stored in the tenant profile snapshot.
 * @param referenceDate - Date used as the "today" reference for age calculation.
 * @returns The age in years or `null` when the birth date is missing.
 */
export function calculateAgeFromBirthDate(
  birthDate: ProfileBirthDate,
  referenceDate: Date = new Date(),
): number | null {
  if (!birthDate) {
    return null;
  }

  const parsedBirthDate = new Date(birthDate);

  if (Number.isNaN(parsedBirthDate.getTime())) {
    return null;
  }

  let age = referenceDate.getUTCFullYear() - parsedBirthDate.getUTCFullYear();
  const hasHadBirthdayThisYear =
    referenceDate.getUTCMonth() > parsedBirthDate.getUTCMonth() ||
    (referenceDate.getUTCMonth() === parsedBirthDate.getUTCMonth() &&
      referenceDate.getUTCDate() >= parsedBirthDate.getUTCDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

/**
 * Formats a stored birth date for an HTML date input.
 * @param birthDate - Birth date stored in the tenant profile snapshot.
 * @returns A `YYYY-MM-DD` string or an empty string when the value is missing.
 */
export function formatBirthDateForDateInput(
  birthDate: ProfileBirthDate,
): string {
  return birthDate ? birthDate.slice(0, 10) : '';
}
