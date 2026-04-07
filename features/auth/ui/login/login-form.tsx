import Link from 'next/link';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';

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
  const resendStatusMessage =
    resent === 'sent'
      ? t.verificationEmailResent
      : resent === 'not_found'
        ? t.verificationEmailNotFound
        : resent === 'already_verified'
          ? t.verificationEmailAlreadyVerified
          : resent === 'inactive'
            ? t.verificationEmailInactive
            : resent === 'verification_disabled'
              ? t.verificationEmailDisabled
              : resent === 'invalid_email'
                ? t.verificationEmailInvalidRequest
                : null;
  const resendSeverity =
    resent === 'sent'
      ? 'success'
      : resent === 'already_verified'
        ? 'info'
        : resent
          ? 'warning'
          : null;
  const resendVerificationAction = email ? (
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
  ) : undefined;

  return (
    <>
      {registered === '1' ? (
        <Alert severity='success' action={resendVerificationAction}>
          {t.registrationSuccess}
        </Alert>
      ) : null}
      {verified === '1' ? (
        <Alert severity='success'>{t.emailVerificationSuccess}</Alert>
      ) : null}
      {resendStatusMessage && resendSeverity ? (
        <Alert severity={resendSeverity}>{resendStatusMessage}</Alert>
      ) : null}
      {passwordReset === '1' ? (
        <Alert severity='success'>{t.passwordResetSuccess}</Alert>
      ) : null}
      {deleted === '1' ? (
        <Alert severity='success'>{t.accountDeleted}</Alert>
      ) : null}
      {error === 'email_not_verified' ? (
        <Alert severity='error' action={resendVerificationAction}>
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
        <FormActionButtons
          clearLabel={translations.common.clearForm}
          submitIcon={<LoginRoundedIcon />}
          submitLabel={t.signInButton}
        />
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
