import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { convertHeightFromMetric } from '@/shared/units/application/unit-conversion';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

type ProfileTranslations = TranslationDictionary['profile'];
type ProfileSnapshot = NonNullable<AuthenticatedUserSnapshot['profile']>;
type ProfileGender = ProfileSnapshot['gender'];
type ProfileActivityLevel = ProfileSnapshot['activityLevel'];
type ProfileHeight = ProfileSnapshot['heightCm'];

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
