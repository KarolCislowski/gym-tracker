import { Alert } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface SettingsFeedbackAlertProps {
  error?: string;
  status?: string;
  translations: TranslationDictionary;
}

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
