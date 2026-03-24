import Link from 'next/link';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { requestPasswordResetAction } from '../../infrastructure/auth.actions';

interface ForgotPasswordFormProps {
  activeLanguage: string;
  error?: string;
  sent?: string;
  translations: TranslationDictionary;
}

/**
 * Renders the email-only form used to start a password-reset flow.
 */
export function ForgotPasswordForm({
  activeLanguage,
  error,
  sent,
  translations,
}: ForgotPasswordFormProps) {
  const t = translations.auth;

  return (
    <>
      {sent === '1' ? <Alert severity='success'>{t.passwordResetRequested}</Alert> : null}
      {error ? <Alert severity='error'>{error}</Alert> : null}
      <Stack action={requestPasswordResetAction} component='form' spacing={1.5}>
        <input name='uiLanguage' type='hidden' value={activeLanguage} />
        <TextField
          autoComplete='email'
          id='email'
          label={t.emailLabel}
          name='email'
          required
          type='email'
        />
        <Button startIcon={<LockResetRoundedIcon />} type='submit' variant='contained'>
          {t.requestPasswordResetButton}
        </Button>
      </Stack>
      <Typography color='text.secondary'>
        <Link href={`/login?lang=${activeLanguage}`}>{t.signInLink}</Link>
      </Typography>
    </>
  );
}
