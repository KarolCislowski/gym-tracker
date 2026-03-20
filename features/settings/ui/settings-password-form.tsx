import { Button, Paper, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { changePasswordAction } from '../infrastructure/settings.actions';

interface SettingsPasswordFormProps {
  translations: TranslationDictionary;
}

/**
 * Form section for changing the signed-in user's password.
 */
export function SettingsPasswordForm({
  translations,
}: SettingsPasswordFormProps) {
  const t = translations.settings;

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 6 }}
    >
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
    </Paper>
  );
}
