import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Paper, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardSettingsWidgetProps {
  settings: NonNullable<AuthenticatedUserSnapshot['settings']>;
  translations: TranslationDictionary['dashboard'];
}

/**
 * Settings widget displaying the current user's preferences snapshot.
 * @param props - Component props for the settings widget.
 * @param props.settings - The authenticated user's tenant settings snapshot.
 * @param props.translations - The localized dashboard translation subset.
 * @returns A React element rendering the dashboard settings widget.
 */
export function DashboardSettingsWidget({
  settings,
  translations,
}: DashboardSettingsWidgetProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <SettingsRoundedIcon color='primary' fontSize='small' />
          <Typography variant='h6'>{translations.settings}</Typography>
        </Stack>
        <Typography color='text.secondary'>
          {translations.settingsLanguage}: <strong>{settings.language}</strong>
        </Typography>
        <Typography color='text.secondary'>
          {translations.settingsTheme}:{' '}
          <strong>{settings.isDarkMode ? translations.themeDark : translations.themeLight}</strong>
        </Typography>
      </Stack>
    </Paper>
  );
}
