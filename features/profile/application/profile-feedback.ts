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
  translations: TranslationDictionary['profile'],
  error?: string,
  status?: string,
): ProfileFeedback {
  if (status === 'updated') {
    return { severity: 'success', message: translations.updated };
  }

  if (error) {
    return { severity: 'error', message: translations.errorGeneric };
  }

  return null;
}
