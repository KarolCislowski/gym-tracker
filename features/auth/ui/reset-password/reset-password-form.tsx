import Link from 'next/link';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { resetPasswordAction } from '../../infrastructure/auth.actions';

interface ResetPasswordFormProps {
  activeLanguage: string;
  error?: string;
  token?: string;
  translations: TranslationDictionary;
}

/**
 * Renders the form used to choose a new password from a one-time reset link.
 */
export function ResetPasswordForm({
  activeLanguage,
  error,
  token,
  translations,
}: ResetPasswordFormProps) {
  const t = translations.auth;
  const resolvedErrorMessage =
    error === 'PASSWORD_CONFIRMATION_MISMATCH'
      ? translations.settings.errorPasswordConfirmationMismatch
      : error === 'PASSWORD_RESET_INVALID'
        ? t.passwordResetLinkInvalid
        : error;

  return (
    <>
      {resolvedErrorMessage ? <Alert severity='error'>{resolvedErrorMessage}</Alert> : null}
      <Stack action={resetPasswordAction} component='form' spacing={1.5}>
        <input name='token' type='hidden' value={token ?? ''} />
        <input name='uiLanguage' type='hidden' value={activeLanguage} />
        <TextField
          autoComplete='new-password'
          label={t.passwordLabel}
          name='newPassword'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <TextField
          autoComplete='new-password'
          label={t.confirmPasswordLabel}
          name='confirmPassword'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <Button startIcon={<LockResetRoundedIcon />} type='submit' variant='contained'>
          {t.resetPasswordButton}
        </Button>
      </Stack>
      <Typography color='text.secondary'>
        <Link href={`/login?lang=${activeLanguage}`}>{t.signInLink}</Link>
      </Typography>
    </>
  );
}
