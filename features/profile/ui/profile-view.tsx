import { Box } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { ProfileField } from '@/shared/ui/ProfileField';

interface ProfileViewProps {
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

function getSexLabel(
  t: TranslationDictionary['profile'],
  value: AuthenticatedUserSnapshot['profile'] extends infer P
    ? P extends { gender: infer G }
      ? G
      : never
    : never,
): string {
  switch (value) {
    case 'female':
      return t.sexFemale;
    case 'male':
      return t.sexMale;
    case 'other':
      return t.sexOther;
    case 'prefer_not_to_say':
      return t.sexPreferNotToSay;
    default:
      return t.emptyValue;
  }
}

function getActivityLabel(
  t: TranslationDictionary['profile'],
  value: AuthenticatedUserSnapshot['profile'] extends infer P
    ? P extends { activityLevel: infer A }
      ? A
      : never
    : never,
): string {
  switch (value) {
    case 'sedentary':
      return t.activitySedentary;
    case 'lightly_active':
      return t.activityLightlyActive;
    case 'moderately_active':
      return t.activityModeratelyActive;
    case 'very_active':
      return t.activityVeryActive;
    case 'extra_active':
      return t.activityExtraActive;
    default:
      return t.emptyValue;
  }
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
        value={getSexLabel(t, profile?.gender ?? null)}
      />
      <ProfileField
        label={t.activityLevelLabel}
        value={getActivityLabel(t, profile?.activityLevel ?? null)}
      />
    </Box>
  );
}
