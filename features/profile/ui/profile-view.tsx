import { Box } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import { getProfileActivityLabel, getProfileSexLabel } from '@/features/profile/application/profile-view';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { ProfileField } from '@/shared/ui/ProfileField';

interface ProfileViewProps {
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Read-only profile presentation view.
 * @param props - Component props for the profile presentation mode.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current profile snapshot.
 * @returns A React element rendering profile values in presentation mode.
 * @remarks This component is intentionally stateless and displays only already-loaded snapshot data.
 */
export function ProfileView({
  translations,
  userSnapshot,
}: ProfileViewProps) {
  const t = translations.profile;
  const profile = userSnapshot?.profile;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      <ProfileField label={t.firstNameLabel} value={profile?.firstName} />
      <ProfileField label={t.lastNameLabel} value={profile?.lastName} />
      <ProfileField label={t.emailLabel} value={profile?.email} />
      <ProfileField
        label={t.ageLabel}
        value={profile?.age != null ? String(profile.age) : undefined}
      />
      <ProfileField
        label={t.biologicalSexLabel}
        value={getProfileSexLabel(t, profile?.gender ?? null)}
      />
      <ProfileField
        label={t.activityLevelLabel}
        value={getProfileActivityLabel(t, profile?.activityLevel ?? null)}
      />
    </Box>
  );
}
