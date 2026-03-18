import Link from 'next/link';
import { redirect } from 'next/navigation';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { auth } from '@/auth';
import { registerAction } from '@/features/auth/infrastructure/auth.actions';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import { COLOR_MODE_COOKIE_NAME, resolveAppColorMode } from '@/shared/theme/application/theme-mode';
import { ColorModeSwitcher } from '@/shared/theme/ui/color-mode-switcher';
import { LanguageSwitcher } from '@/shared/i18n/ui/language-switcher';
import { cookies } from 'next/headers';

interface RegisterPageProps {
  searchParams?: Promise<{
    error?: string;
    lang?: string;
  }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const session = await auth();
  const cookieStore = await cookies();
  const params = searchParams ? await searchParams : undefined;
  const activeLanguage = resolveLanguage(params?.lang);
  const activeColorMode = resolveAppColorMode(
    cookieStore.get(COLOR_MODE_COOKIE_NAME)?.value,
  );
  const t = getTranslations(activeLanguage);

  if (session?.user) {
    redirect('/');
  }

  return (
    <Box
      component='main'
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 'min(100%, 520px)',
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 6,
        }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <LanguageSwitcher
              activeLanguage={activeLanguage}
              pathname='/register'
              query={{
                error: params?.error,
              }}
            />
            <ColorModeSwitcher mode={activeColorMode} />
          </Stack>
          <Typography variant='overline' color='text.secondary'>
            {t.auth.appName}
          </Typography>
          <Typography component='h1' variant='h2'>
            {t.auth.registerTitle}
          </Typography>
          <Typography color='text.secondary'>
            {t.auth.registerDescription}
          </Typography>
          {params?.error ? (
            <Alert severity='error'>{params.error}</Alert>
          ) : null}
          <Stack component='form' action={registerAction} spacing={1.5}>
            <input name='uiLanguage' type='hidden' value={activeLanguage} />
            <TextField
              id='firstName'
              label={t.auth.firstNameLabel}
              name='firstName'
              required
              slotProps={{ htmlInput: { minLength: 2 } }}
              type='text'
            />
            <TextField
              id='lastName'
              label={t.auth.lastNameLabel}
              name='lastName'
              required
              slotProps={{ htmlInput: { minLength: 2 } }}
              type='text'
            />
            <TextField
              autoComplete='email'
              id='email'
              label={t.auth.emailLabel}
              name='email'
              required
              type='email'
            />
            <TextField
              autoComplete='new-password'
              id='password'
              label={t.auth.passwordLabel}
              name='password'
              required
              slotProps={{ htmlInput: { minLength: 8 } }}
              type='password'
            />
            <TextField
              defaultValue={activeLanguage}
              id='language'
              label={t.auth.languageLabel}
              select
              name='language'>
              <MenuItem value='en'>{t.auth.languageEnglish}</MenuItem>
              <MenuItem value='pl'>{t.auth.languagePolish}</MenuItem>
              <MenuItem value='sv'>{t.auth.languageSwedish}</MenuItem>
            </TextField>
            <FormControlLabel
              control={<Checkbox id='isDarkMode' name='isDarkMode' />}
              label={t.auth.darkModeLabel}
              sx={{ color: 'text.secondary' }}
            />
            <Button
              startIcon={<AppRegistrationRoundedIcon />}
              type='submit'
              variant='contained'>
              {t.auth.registerButton}
            </Button>
          </Stack>
          <Typography color='text.secondary'>
            {t.auth.alreadyHaveAccount}{' '}
            <Link href={`/login?lang=${activeLanguage}`}>
              {t.auth.signInLink}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
