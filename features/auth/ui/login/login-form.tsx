import Link from 'next/link';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import {
  loginAction,
  resendVerificationEmailAction,
} from '../../infrastructure/auth.actions';

interface LoginFormProps {
  activeLanguage: string;
  deleted?: string;
  error?: string;
  email?: string;
  registered?: string;
  resent?: string;
  passwordReset?: string;
  verified?: string;
  translations: TranslationDictionary;
}

/**
 * Presentation component for the login form and related status messages.
 */
export function LoginForm({
  activeLanguage,
  deleted,
  error,
  email,
  registered,
  resent,
  passwordReset,
  verified,
  translations,
}: LoginFormProps) {
  const t = translations.auth;
  const resolvedErrorMessage =
    error === 'invalid_credentials'
      ? t.invalidCredentialsError
      : error === 'verification_invalid'
        ? t.verificationLinkInvalid
        : error;

  return (
    <>
      {registered === '1' ? (
        <Alert severity='success'>{t.registrationSuccess}</Alert>
      ) : null}
      {verified === '1' ? (
        <Alert severity='success'>{t.emailVerificationSuccess}</Alert>
      ) : null}
      {resent === '1' ? (
        <Alert severity='success'>{t.verificationEmailResent}</Alert>
      ) : null}
      {passwordReset === '1' ? (
        <Alert severity='success'>{t.passwordResetSuccess}</Alert>
      ) : null}
      {deleted === '1' ? (
        <Alert severity='success'>{t.accountDeleted}</Alert>
      ) : null}
      {error === 'email_not_verified' ? (
        <Alert
          severity='error'
          action={
            email ? (
              <Stack
                action={resendVerificationEmailAction}
                component='form'
                sx={{ alignItems: 'center' }}
              >
                <input name='uiLanguage' type='hidden' value={activeLanguage} />
                <input name='email' type='hidden' value={email} />
                <Button color='inherit' size='small' type='submit' variant='text'>
                  {t.resendVerificationButton}
                </Button>
              </Stack>
            ) : undefined
          }
        >
          {t.emailVerificationRequired}
        </Alert>
      ) : resolvedErrorMessage ? (
        <Alert severity='error'>{resolvedErrorMessage}</Alert>
      ) : null}
      <Stack
        sx={{ gap: 2 }}
        component='form'
        action={loginAction}
        spacing={1.5}>
        <input name='uiLanguage' type='hidden' value={activeLanguage} />
        <TextField
          autoComplete='email'
          defaultValue={email}
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
        <Link href={`/forgot-password?lang=${activeLanguage}`}>
          {t.forgotPasswordLink}
        </Link>
      </Typography>
      <Typography color='text.secondary'>
        {t.newHere}{' '}
        <Link href={`/register?lang=${activeLanguage}`}>
          {t.createAccountLink}
        </Link>
      </Typography>
    </>
  );
}
