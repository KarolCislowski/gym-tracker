import { Alert } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardLayoutFeedbackAlertProps {
  error?: string;
  status?: string;
  translations: TranslationDictionary;
}

/**
 * Resolves dashboard layout status and error codes into translated alert content.
 * @param t - The translated dashboard message bundle.
 * @param error - Optional error code returned by dashboard layout actions.
 * @param status - Optional success status returned by dashboard layout actions.
 * @returns Alert metadata when a matching message exists; otherwise `null`.
 */
function resolveFeedback(
  t: TranslationDictionary['dashboard'],
  error?: string,
  status?: string,
): { severity: 'success' | 'error'; message: string } | null {
  if (status === 'dashboard-layout-updated') {
    return { severity: 'success', message: t.dashboardLayoutUpdated };
  }

  if (status === 'dashboard-layout-reset') {
    return { severity: 'success', message: t.dashboardLayoutReset };
  }

  switch (error) {
    case undefined:
      return null;
    default:
      return { severity: 'error', message: t.dashboardLayoutErrorGeneric };
  }
}

/**
 * Renders translated feedback for dashboard layout customization actions.
 * @param props - Component props for dashboard layout feedback rendering.
 * @param props.error - Optional error code returned by a dashboard layout action.
 * @param props.status - Optional success status returned by a dashboard layout action.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A translated alert element when feedback is available; otherwise `null`.
 */
export function DashboardLayoutFeedbackAlert({
  error,
  status,
  translations,
}: DashboardLayoutFeedbackAlertProps) {
  const feedback = resolveFeedback(translations.dashboard, error, status);

  if (!feedback) {
    return null;
  }

  return <Alert severity={feedback.severity}>{feedback.message}</Alert>;
}
