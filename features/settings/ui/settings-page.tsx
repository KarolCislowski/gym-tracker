import {
  Box,
  Stack,
  Typography,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { getColorModeFromSettings } from '@/shared/theme/application/theme-mode';
import { ThemeModeSync } from '@/shared/theme/ui/theme-mode-sync';

import { SettingsDeleteAccountForm } from './settings-delete-account-form';
import { SettingsFeedbackAlert } from './settings-feedback-alert';
import { SettingsPasswordForm } from './settings-password-form';
import { SettingsPreferencesForm } from './settings-preferences-form';

interface SettingsPageProps {
  email: string;
  error?: string;
  status?: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Authenticated settings view for tenant preferences and account management.
 */
export function SettingsPage({
  email,
  error,
  status,
  translations,
  userSnapshot,
}: SettingsPageProps) {
  const t = translations.settings;
  const activeSettings = userSnapshot?.settings;

  return (
    <Stack spacing={3}>
      {activeSettings ? (
        <ThemeModeSync mode={getColorModeFromSettings(activeSettings.isDarkMode)} />
      ) : null}
      <Stack spacing={1}>
        <Typography variant='h3'>{t.title}</Typography>
        <Typography color='text.secondary'>{t.description}</Typography>
      </Stack>

      <SettingsFeedbackAlert
        error={error}
        status={status}
        translations={translations}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <SettingsPreferencesForm
          translations={translations}
          userSnapshot={userSnapshot}
        />
        <SettingsPasswordForm translations={translations} />
      </Box>
      <SettingsDeleteAccountForm email={email} translations={translations} />
    </Stack>
  );
}
