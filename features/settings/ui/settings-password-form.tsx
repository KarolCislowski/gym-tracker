import { Button, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { AppCard } from '@/shared/ui/app-card';

import { changePasswordAction } from '../infrastructure/settings.actions';

interface SettingsPasswordFormProps {
  translations: TranslationDictionary;
}

/**
 * Form section for changing the signed-in user's password.
 * @param props - Component props for the password change form.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the password change form.
 * @remarks The form posts to a server action and requires the current password for confirmation.
 */
export function SettingsPasswordForm({
  translations,
}: SettingsPasswordFormProps) {
  const t = translations.settings;

  return (
    <AppCard padding='lg' radius='lg' tone='standard'>
      <Stack component='form' action={changePasswordAction} spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant='h6'>{t.securityTitle}</Typography>
          <Typography color='text.secondary'>{t.securityDescription}</Typography>
        </Stack>
        <TextField
          label={t.currentPasswordLabel}
          name='currentPassword'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <TextField
          label={t.newPasswordLabel}
          name='newPassword'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <TextField
          label={t.confirmPasswordLabel}
          name='confirmPassword'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <Button type='submit' variant='contained'>
          {t.changePassword}
        </Button>
      </Stack>
    </AppCard>
  );
}
