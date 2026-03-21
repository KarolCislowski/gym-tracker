import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

type ProfileFeedback = { severity: 'success' | 'error'; message: string } | null;

/**
 * Maps profile page query-state flags to a user-facing alert payload.
 * @param translations - The localized profile translation subset.
 * @param error - Optional error code returned by profile actions.
 * @param status - Optional success status returned by profile actions.
 * @returns Alert payload for the page, or `null` when no feedback should be shown.
 */
export function resolveProfileFeedback(
  translations: Pick<
    TranslationDictionary,
    'healthyHabits' | 'profile'
  >,
  error?: string,
  status?: string,
): ProfileFeedback {
  if (status === 'profile-updated') {
    return { severity: 'success', message: translations.profile.updated };
  }

  if (status === 'healthy-habits-updated') {
    return {
      severity: 'success',
      message: translations.healthyHabits.updated,
    };
  }

  if (error) {
    return {
      severity: 'error',
      message: error.startsWith('HEALTHY_HABITS_')
        ? translations.healthyHabits.errorGeneric
        : translations.profile.errorGeneric,
    };
  }

  return null;
}
