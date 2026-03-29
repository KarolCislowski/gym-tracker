'use client';

import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import type { DashboardWidgetTone } from '../../application/dashboard-widget-registry';
import { DashboardWidgetShell } from '../layout/dashboard-widget-shell';

interface DashboardSettingsWidgetProps {
  settings: NonNullable<AuthenticatedUserSnapshot['settings']>;
  tone?: DashboardWidgetTone;
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
  tone = 'glass',
  translations,
}: DashboardSettingsWidgetProps) {
  return (
    <DashboardWidgetShell density='dense' height='compact' tone={tone}>
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <SettingsRoundedIcon color='primary' fontSize='small' />
          <Typography component='h2' variant='h6'>
            {translations.settings}
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <SettingsRow
            label={translations.settingsLanguage}
            value={settings.language}
          />
          <SettingsRow
            label={translations.settingsUnitSystem}
            value={
              settings.unitSystem === 'metric'
                ? translations.unitSystemMetric
                : settings.unitSystem === 'imperial_us'
                  ? translations.unitSystemImperialUs
                  : translations.unitSystemImperialUk
            }
          />
          <SettingsRow
            label={translations.settingsTheme}
            value={
              settings.isDarkMode ? translations.themeDark : translations.themeLight
            }
          />
        </Stack>
      </Stack>
    </DashboardWidgetShell>
  );
}

function SettingsRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      spacing={2}
      sx={{
        px: 1.25,
        py: 1,
        borderRadius: 3,
        border: 1,
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(148, 163, 184, 0.16)'
            : 'rgba(148, 163, 184, 0.2)',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(255, 255, 255, 0.58)',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? 'none'
            : '0 6px 18px rgba(148, 163, 184, 0.08)',
      }}
    >
      <Typography color='text.secondary' variant='body2'>
        {label}
      </Typography>
      <Typography variant='subtitle2'>{value}</Typography>
    </Stack>
  );
}
