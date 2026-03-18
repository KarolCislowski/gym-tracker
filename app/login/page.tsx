import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { auth } from '@/auth';
import { loginAction } from '@/features/auth/infrastructure/auth.actions';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import { COLOR_MODE_COOKIE_NAME, resolveAppColorMode } from '@/shared/theme/application/theme-mode';
import { ColorModeSwitcher } from '@/shared/theme/ui/color-mode-switcher';
import { LanguageSwitcher } from '@/shared/i18n/ui/language-switcher';
import { cookies } from 'next/headers';

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
    registered?: string;
    lang?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
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
          width: 'min(100%, 560px)',
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 6,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <LanguageSwitcher
              activeLanguage={activeLanguage}
              pathname='/login'
              query={{
                error: params?.error,
                registered: params?.registered,
              }}
            />
            <ColorModeSwitcher mode={activeColorMode} />
          </Stack>
          <Typography variant='overline' color='text.secondary'>
            {t.auth.appName}
          </Typography>
          <Typography component='h1' variant='h2'>
            {t.auth.signInTitle}
          </Typography>
          <Typography color='text.secondary'>{t.auth.signInDescription}</Typography>
          {params?.registered === '1' ? (
            <Alert severity='success'>{t.auth.registrationSuccess}</Alert>
          ) : null}
          {params?.error ? <Alert severity='error'>{params.error}</Alert> : null}
          <Stack component='form' action={loginAction} spacing={1.5}>
            <input name='uiLanguage' type='hidden' value={activeLanguage} />
            <TextField
              autoComplete='email'
              id='email'
              label={t.auth.emailLabel}
              name='email'
              required
              type='email'
            />
            <TextField
              autoComplete='current-password'
              id='password'
              label={t.auth.passwordLabel}
              name='password'
              required
              slotProps={{ htmlInput: { minLength: 8 } }}
              type='password'
            />
            <Button
              startIcon={<LoginRoundedIcon />}
              type='submit'
              variant='contained'
            >
              {t.auth.signInButton}
            </Button>
          </Stack>
          <Typography color='text.secondary'>
            {t.auth.newHere}{' '}
            <Link href={`/register?lang=${activeLanguage}`}>
              {t.auth.createAccountLink}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
