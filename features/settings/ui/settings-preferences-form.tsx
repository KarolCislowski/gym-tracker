import {
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';

import { updateSettingsAction } from '../infrastructure/settings.actions';

interface SettingsPreferencesFormProps {
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Form section for updating tenant preference values from the Settings document.
 * @param props - Component props for the tenant preferences form.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's snapshot containing the current settings values.
 * @returns A React element rendering the tenant preferences form.
 * @remarks The form uses server actions and defaults to the current persisted tenant settings.
 */
export function SettingsPreferencesForm({
  translations,
  userSnapshot,
}: SettingsPreferencesFormProps) {
  const t = translations.settings;
  const activeSettings = userSnapshot?.settings;

  return (
    <AppCard padding='lg' radius='lg' tone='standard'>
      <Stack component='form' action={updateSettingsAction} spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant='h6'>{t.preferencesTitle}</Typography>
          <Typography color='text.secondary'>{t.preferencesDescription}</Typography>
        </Stack>
        <TextField
          defaultValue={activeSettings?.language ?? 'en'}
          id='language'
          label={t.languageLabel}
          name='language'
          select
        >
          <MenuItem value='en'>{translations.auth.languageEnglish}</MenuItem>
          <MenuItem value='pl'>{translations.auth.languagePolish}</MenuItem>
          <MenuItem value='sv'>{translations.auth.languageSwedish}</MenuItem>
        </TextField>
        <TextField
          defaultValue={activeSettings?.unitSystem ?? 'metric'}
          id='unitSystem'
          label={t.unitSystemLabel}
          name='unitSystem'
          select
        >
          <MenuItem value='metric'>{t.unitSystemMetric}</MenuItem>
          <MenuItem value='imperial_us'>{t.unitSystemImperialUs}</MenuItem>
          <MenuItem value='imperial_uk'>{t.unitSystemImperialUk}</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Switch
              defaultChecked={activeSettings?.isDarkMode ?? false}
              name='isDarkMode'
            />
          }
          label={t.darkModeLabel}
        />
        <Stack spacing={0.5}>
          <FormControlLabel
            control={
              <Switch
                defaultChecked={activeSettings?.trackMenstrualCycle ?? false}
                name='trackMenstrualCycle'
              />
            }
            label={t.trackMenstrualCycleLabel}
          />
          <Typography color='text.secondary' variant='body2'>
            {t.trackMenstrualCycleHelper}
          </Typography>
        </Stack>
        <Stack spacing={0.5}>
          <FormControlLabel
            control={
              <Switch
                defaultChecked={activeSettings?.trackLibido ?? false}
                name='trackLibido'
              />
            }
            label={t.trackLibidoLabel}
          />
          <Typography color='text.secondary' variant='body2'>
            {t.trackLibidoHelper}
          </Typography>
        </Stack>
        <FormActionButtons
          clearLabel={translations.common.clearForm}
          submitLabel={t.savePreferences}
        />
      </Stack>
    </AppCard>
  );
}
