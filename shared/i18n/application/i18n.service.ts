import type {
  SupportedLanguage,
  TranslationDictionary,
  TranslationDictionaryOverrides,
} from '../domain/i18n.types';
import { enMessages } from '../infrastructure/messages/en';
import { plMessages } from '../infrastructure/messages/pl';
import { svMessages } from '../infrastructure/messages/sv';

const messageCatalog: Record<
  SupportedLanguage,
  TranslationDictionary | TranslationDictionaryOverrides
> = {
  en: enMessages,
  pl: plMessages,
  sv: svMessages,
};

/**
 * Resolves the active language. Unsupported or missing values fall back to English.
 */
export function resolveLanguage(
  language?: string | null,
): SupportedLanguage {
  if (language === 'pl' || language === 'sv') {
    return language;
  }

  return 'en';
}

/**
 * Returns translations for the active language with an English fallback per key.
 */
export function getTranslations(
  language?: string | null,
): TranslationDictionary {
  const activeLanguage = resolveLanguage(language);
  const localized = messageCatalog[activeLanguage];

  return {
    common: {
      ...enMessages.common,
      ...localized.common,
    },
    auth: {
      ...enMessages.auth,
      ...localized.auth,
    },
    dashboard: {
      ...enMessages.dashboard,
      ...localized.dashboard,
    },
    onboarding: {
      ...enMessages.onboarding,
      ...localized.onboarding,
    },
    settings: {
      ...enMessages.settings,
      ...localized.settings,
    },
    profile: {
      ...enMessages.profile,
      ...localized.profile,
    },
    exercises: {
      ...enMessages.exercises,
      ...localized.exercises,
    },
    supplements: {
      ...enMessages.supplements,
      ...localized.supplements,
    },
    supplementation: {
      ...enMessages.supplementation,
      ...localized.supplementation,
    },
    workouts: {
      ...enMessages.workouts,
      ...localized.workouts,
    },
    dailyReports: {
      ...enMessages.dailyReports,
      ...localized.dailyReports,
    },
    healthyHabits: {
      ...enMessages.healthyHabits,
      ...localized.healthyHabits,
    },
  };
}
