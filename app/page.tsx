import Link from 'next/link';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { logoutAction } from '@/features/auth/infrastructure/auth.actions';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

export default async function Page() {
  const session = await auth();
  const userSnapshot =
    session?.user?.id && session.user.tenantDbName
      ? await getAuthenticatedUserSnapshot(
          session.user.tenantDbName,
          session.user.id,
        )
      : null;
  const t = getTranslations(userSnapshot?.settings?.language);

  return (
    <Box
      component='main'
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 6 },
      }}>
      <Paper
        elevation={3}
        sx={{
          width: 'min(100%, 720px)',
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 6,
        }}>
        <Stack spacing={2}>
          <Chip
            icon={<DashboardRoundedIcon />}
            label={t.auth.appName}
            color='secondary'
            variant='outlined'
            sx={{ alignSelf: 'flex-start' }}
          />
          <Typography component='h1' variant='h2'>
            {t.auth.homeTitle}
          </Typography>
          <Typography component='h2' variant='h5' color='text.secondary'>
            {t.auth.aboutTitle}
          </Typography>
          {session?.user ? (
            <Stack spacing={2}>
              <Typography color='text.secondary'>
                {t.auth.signedInAs} <strong>{session.user.email}</strong>.
              </Typography>
              <Typography color='text.secondary'>
                {t.auth.tenantDatabase}:{' '}
                <strong>{session.user.tenantDbName}</strong>
              </Typography>
              {userSnapshot?.profile ? (
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.46)',
                  }}>
                  <Stack spacing={1}>
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <PersonRoundedIcon color='primary' fontSize='small' />
                      <Typography variant='h6'>
                        {t.auth.profileTitle}
                      </Typography>
                    </Stack>
                    <Typography color='text.secondary'>
                      {t.auth.profileName}:{' '}
                      <strong>
                        {userSnapshot.profile.firstName}{' '}
                        {userSnapshot.profile.lastName}
                      </strong>
                    </Typography>
                    <Typography color='text.secondary'>
                      {t.auth.profileEmail}:{' '}
                      <strong>{userSnapshot.profile.email}</strong>
                    </Typography>
                  </Stack>
                </Paper>
              ) : null}
              {userSnapshot?.settings ? (
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.46)',
                  }}>
                  <Stack spacing={1}>
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <SettingsRoundedIcon color='primary' fontSize='small' />
                      <Typography variant='h6'>
                        {t.auth.settingsTitle}
                      </Typography>
                    </Stack>
                    <Typography color='text.secondary'>
                      {t.auth.settingsLanguage}:{' '}
                      <strong>{userSnapshot.settings.language}</strong>
                    </Typography>
                    <Typography color='text.secondary'>
                      {t.auth.settingsDarkMode}:{' '}
                      <strong>
                        {userSnapshot.settings.isDarkMode
                          ? t.auth.darkModeEnabled
                          : t.auth.darkModeDisabled}
                      </strong>
                    </Typography>
                  </Stack>
                </Paper>
              ) : null}
              <Box component='form' action={logoutAction}>
                <Button
                  startIcon={<LogoutRoundedIcon />}
                  type='submit'
                  variant='contained'>
                  {t.auth.signOut}
                </Button>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Alert severity='info' variant='outlined'>
                {t.auth.signInDescription}
              </Alert>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Link href='/login'>
                  <Button
                    startIcon={<LoginRoundedIcon />}
                    variant='contained'>
                    {t.auth.signIn}
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button
                    startIcon={<AppRegistrationRoundedIcon />}
                    variant='outlined'>
                    {t.auth.createAccount}
                  </Button>
                </Link>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
