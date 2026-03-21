import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import {
  convertHydrationFromMetricLiters,
} from '@/shared/units/application/unit-conversion';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

type HealthyHabitsTranslations = TranslationDictionary['healthyHabits'];
type HealthyHabitsSnapshot = NonNullable<AuthenticatedUserSnapshot['healthyHabits']>;

/**
 * Formats hydration goal using the active measurement system.
 * @param translations - The localized healthy habits translation subset.
 * @param value - Hydration goal stored in metric liters.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns Formatted hydration goal string or the empty-state label.
 */
export function getHealthyHabitsWaterLabel(
  translations: HealthyHabitsTranslations,
  value: HealthyHabitsSnapshot['waterLitersPerDay'],
  unitSystem: UnitSystem,
): string {
  if (value == null) {
    return translations.emptyValue;
  }

  const convertedValue = convertHydrationFromMetricLiters(value, unitSystem);

  return `${convertedValue.value} ${convertedValue.unit}`;
}

/**
 * Formats protein goal using the active measurement system.
 * @param translations - The localized healthy habits translation subset.
 * @param value - Protein goal stored in metric grams.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns Formatted protein goal string or the empty-state label.
 */
export function getHealthyHabitsProteinLabel(
  translations: HealthyHabitsTranslations,
  value: HealthyHabitsSnapshot['proteinGramsPerDay'],
  _unitSystem: UnitSystem,
): string {
  if (value == null) {
    return translations.emptyValue;
  }

  return `${value} g`;
}
