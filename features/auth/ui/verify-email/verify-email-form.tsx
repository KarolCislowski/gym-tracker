import Link from 'next/link';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import { Alert, Button, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { verifyEmailAction } from '../../infrastructure/auth.actions';

interface VerifyEmailFormProps {
  activeLanguage: string;
  token: string;
  translations: TranslationDictionary;
}

/**
 * Renders the explicit confirmation step for email verification links.
 */
export function VerifyEmailForm({
  activeLanguage,
  token,
  translations,
}: VerifyEmailFormProps) {
  const t = translations.auth;
  const hasToken = token.trim().length > 0;

  if (!hasToken) {
    return (
      <Stack spacing={2}>
        <Alert severity='error'>{t.verifyEmailInvalidDescription}</Alert>
        <Typography color='text.secondary'>
          <Link href={`/login?lang=${activeLanguage}`}>
            {t.signInLink}
          </Link>
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack component='form' action={verifyEmailAction} spacing={2}>
      <input name='uiLanguage' type='hidden' value={activeLanguage} />
      <input name='token' type='hidden' value={token} />
      <Alert severity='info'>{t.verifyEmailDescription}</Alert>
      <Button
        size='large'
        startIcon={<MarkEmailReadRoundedIcon />}
        type='submit'
        variant='contained'
      >
        {t.verifyEmailButton}
      </Button>
      <Typography color='text.secondary'>
        <Link href={`/login?lang=${activeLanguage}`}>
          {t.signInLink}
        </Link>
      </Typography>
    </Stack>
  );
}
