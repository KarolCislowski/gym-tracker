import Link from 'next/link';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { loginAction } from '../../infrastructure/auth.actions';

interface LoginFormProps {
  activeLanguage: string;
  deleted?: string;
  error?: string;
  registered?: string;
  translations: TranslationDictionary;
}

/**
 * Presentation component for the login form and related status messages.
 */
export function LoginForm({
  activeLanguage,
  deleted,
  error,
  registered,
  translations,
}: LoginFormProps) {
  const t = translations.auth;

  return (
    <>
      {registered === '1' ? (
        <Alert severity='success'>{t.registrationSuccess}</Alert>
      ) : null}
      {deleted === '1' ? (
        <Alert severity='success'>{t.accountDeleted}</Alert>
      ) : null}
      {error ? <Alert severity='error'>{error}</Alert> : null}
      <Stack
        sx={{ gap: 2 }}
        component='form'
        action={loginAction}
        spacing={1.5}>
        <input name='uiLanguage' type='hidden' value={activeLanguage} />
        <TextField
          autoComplete='email'
          id='email'
          label={t.emailLabel}
          name='email'
          required
          type='email'
        />
        <TextField
          autoComplete='current-password'
          id='password'
          label={t.passwordLabel}
          name='password'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <Button
          startIcon={<LoginRoundedIcon />}
          type='submit'
          variant='contained'>
          {t.signInButton}
        </Button>
      </Stack>
      <Typography color='text.secondary'>
        {t.newHere}{' '}
        <Link href={`/register?lang=${activeLanguage}`}>
          {t.createAccountLink}
        </Link>
      </Typography>
    </>
  );
}
