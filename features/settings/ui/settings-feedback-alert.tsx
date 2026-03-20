import { Alert } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface SettingsFeedbackAlertProps {
  error?: string;
  status?: string;
  translations: TranslationDictionary;
}

/**
 * Maps settings route status and error codes to translated alert content.
 * @param t - The translated settings message bundle.
 * @param error - Optional error code from a failed settings action.
 * @param status - Optional success status from a completed settings action.
 * @returns Alert metadata when a matching message exists; otherwise `null`.
 * @remarks This helper keeps route-level query params decoupled from display strings.
 */
function resolveFeedback(
  t: TranslationDictionary['settings'],
  error?: string,
  status?: string,
): { severity: 'success' | 'error'; message: string } | null {
  if (status === 'preferences-updated') {
    return { severity: 'success', message: t.preferencesUpdated };
  }

  if (status === 'password-updated') {
    return { severity: 'success', message: t.passwordUpdated };
  }

  switch (error) {
    case 'SETTINGS_ERROR_INVALID_CURRENT_PASSWORD':
      return { severity: 'error', message: t.errorInvalidCurrentPassword };
    case 'PASSWORD_CONFIRMATION_MISMATCH':
    case 'SETTINGS_ERROR_PASSWORD_CONFIRMATION_MISMATCH':
      return { severity: 'error', message: t.errorPasswordConfirmationMismatch };
    case 'SETTINGS_ERROR_CONFIRMATION_EMAIL_MISMATCH':
      return { severity: 'error', message: t.errorConfirmationEmailMismatch };
    case undefined:
      return null;
    default:
      return { severity: 'error', message: t.errorGeneric };
  }
}

/**
 * Resolves and renders feedback messages for settings actions.
 * @param props - Component props for settings feedback rendering.
 * @param props.error - Optional error code from a settings action.
 * @param props.status - Optional success status from a settings action.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A translated alert element when feedback is available; otherwise `null`.
 * @remarks This component intentionally renders nothing when the route has no actionable feedback.
 */
export function SettingsFeedbackAlert({
  error,
  status,
  translations,
}: SettingsFeedbackAlertProps) {
  const feedback = resolveFeedback(translations.settings, error, status);

  if (!feedback) {
    return null;
  }

  return <Alert severity={feedback.severity}>{feedback.message}</Alert>;
}
