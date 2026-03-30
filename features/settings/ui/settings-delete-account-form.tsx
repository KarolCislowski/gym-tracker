import { Alert, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';

import { deleteAccountAction } from '../infrastructure/settings.actions';

interface SettingsDeleteAccountFormProps {
  email: string;
  translations: TranslationDictionary;
}

/**
 * Danger-zone form section for deleting the signed-in account with explicit confirmation.
 * @param props - Component props for the account deletion form.
 * @param props.email - The signed-in user's email shown as the confirmation target.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the account deletion form.
 * @remarks Account deletion requires both the current password and a matching confirmation email.
 */
export function SettingsDeleteAccountForm({
  email,
  translations,
}: SettingsDeleteAccountFormProps) {
  const t = translations.settings;

  return (
    <AppCard padding='lg' radius='lg' tone='standard'>
      <Stack component='form' action={deleteAccountAction} spacing={2}>
        <Stack spacing={0.5}>
          <Typography color='error.main' variant='h6'>
            {t.dangerZoneTitle}
          </Typography>
          <Typography color='text.secondary'>{t.dangerZoneDescription}</Typography>
        </Stack>
        <Alert severity='warning'>{t.deleteAccountWarning}</Alert>
        <TextField
          helperText={t.confirmationEmailHelp}
          label={t.confirmationEmailLabel}
          name='confirmationEmail'
          required
          type='email'
        />
        <TextField
          label={t.currentPasswordLabel}
          name='currentPassword'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <FormActionButtons
          clearLabel={translations.common.clearForm}
          submitColor='error'
          submitLabel={t.deleteAccount}
        />
        <Typography color='text.secondary' variant='body2'>
          {email}
        </Typography>
      </Stack>
    </AppCard>
  );
}
