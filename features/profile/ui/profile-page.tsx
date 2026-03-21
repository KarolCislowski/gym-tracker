import { Alert, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import { HealthyHabitsSection } from '@/features/healthy-habits/ui/healthy-habits-section';
import { resolveProfileFeedback } from '@/features/profile/application/profile-feedback';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { ProfileDetailsSection } from './profile-details-section';

interface ProfilePageProps {
  error?: string;
  section?: string;
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
  section,
  status,
  translations,
  userSnapshot,
}: ProfilePageProps) {
  const t = translations.profile;
  const feedback = resolveProfileFeedback(translations, error, status);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant='h3'>{t.title}</Typography>
        <Typography color='text.secondary'>{t.description}</Typography>
      </Stack>

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}
      <ProfileDetailsSection
        initialMode={section === 'profile' && error ? 'edit' : 'view'}
        translations={translations}
        userSnapshot={userSnapshot}
      />
      <HealthyHabitsSection
        initialMode={section === 'healthy-habits' && error ? 'edit' : 'view'}
        translations={translations}
        userSnapshot={userSnapshot}
      />
    </Stack>
  );
}
