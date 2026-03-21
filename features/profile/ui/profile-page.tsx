import { Alert, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import { resolveProfileFeedback } from '@/features/profile/application/profile-feedback';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { ProfileDetailsSection } from './profile-details-section';

interface ProfilePageProps {
  error?: string;
  status?: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Profile page with view and edit modes for tenant profile data.
 * @param props - Component props for the profile page.
 * @param props.error - Optional error code returned by profile actions.
 * @param props.status - Optional success status returned by profile actions.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current profile and settings snapshot.
 * @returns A React element rendering the server-side profile page shell.
 * @remarks Interactive edit state is delegated to a client wrapper at the section level.
 */
export function ProfilePage({
  error,
  status,
  translations,
  userSnapshot,
}: ProfilePageProps) {
  const t = translations.profile;
  const feedback = resolveProfileFeedback(t, error, status);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant='h3'>{t.title}</Typography>
        <Typography color='text.secondary'>{t.description}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}
      <ProfileDetailsSection
        initialMode={error ? 'edit' : 'view'}
        translations={translations}
        userSnapshot={userSnapshot}
      />
    </Stack>
  );
}
