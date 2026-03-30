import Link from 'next/link';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import {
  Alert,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';

import { registerAction } from '../../infrastructure/auth.actions';

interface RegisterFormProps {
  activeLanguage: string;
  error?: string;
  translations: TranslationDictionary;
}

/**
 * Presentation component for the registration form and related status messages.
 */
export function RegisterForm({
  activeLanguage,
  error,
  translations,
}: RegisterFormProps) {
  const t = translations.auth;

  return (
    <>
      {error ? <Alert severity='error'>{error}</Alert> : null}
      <Stack
        sx={{ gap: 2 }}
        component='form'
        action={registerAction}
        spacing={1.5}>
        <input name='uiLanguage' type='hidden' value={activeLanguage} />
        <TextField
          id='firstName'
          label={t.firstNameLabel}
          name='firstName'
          required
          slotProps={{ htmlInput: { minLength: 2 } }}
          type='text'
        />
        <TextField
          id='lastName'
          label={t.lastNameLabel}
          name='lastName'
          required
          slotProps={{ htmlInput: { minLength: 2 } }}
          type='text'
        />
        <TextField
          autoComplete='email'
          id='email'
          label={t.emailLabel}
          name='email'
          required
          type='email'
        />
        <TextField
          autoComplete='new-password'
          id='password'
          label={t.passwordLabel}
          name='password'
          required
          slotProps={{ htmlInput: { minLength: 8 } }}
          type='password'
        />
        <TextField
          key={`register-language-${activeLanguage}`}
          defaultValue={activeLanguage}
          id='language'
          label={t.languageLabel}
          select
          name='language'>
          <MenuItem value='en'>{t.languageEnglish}</MenuItem>
          <MenuItem value='pl'>{t.languagePolish}</MenuItem>
          <MenuItem value='sv'>{t.languageSwedish}</MenuItem>
        </TextField>
        <FormControlLabel
          control={<Checkbox id='isDarkMode' name='isDarkMode' />}
          label={t.darkModeLabel}
          sx={{ color: 'text.secondary' }}
        />
        <FormActionButtons
          clearLabel={translations.common.clearForm}
          submitIcon={<AppRegistrationRoundedIcon />}
          submitLabel={t.registerButton}
        />
      </Stack>
      <Typography color='text.secondary'>
        {t.alreadyHaveAccount}{' '}
        <Link href={`/login?lang=${activeLanguage}`}>{t.signInLink}</Link>
      </Typography>
    </>
  );
}
