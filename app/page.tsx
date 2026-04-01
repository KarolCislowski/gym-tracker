import Link from 'next/link';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import { Alert, Box, Button, Stack } from '@mui/material';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { buildDashboardAnalytics } from '@/features/dashboard/application/dashboard-analytics';
import { getResolvedDashboardLayout } from '@/features/dashboard/application/dashboard-layout.service';
import { listDailyReports } from '@/features/daily-reports/application/daily-report.service';
import {
  listExerciseAtlas,
  listFavoriteExercises,
} from '@/features/exercises/application/exercise-atlas.service';
import {
  listWorkoutSessions,
  listWorkoutSessionsForAnalytics,
} from '@/features/workouts/application/workout.service';
import { DashboardHome } from '@/features/dashboard/ui/dashboard-home';
import { resolveDashboardNextAction } from '@/features/dashboard/application/dashboard-next-action';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface HomePageProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function Page({ searchParams }: HomePageProps) {
  const session = await auth();
  const resolvedSearchParams = await searchParams;
  const userSnapshot =
    session?.user?.id && session.user.tenantDbName
      ? await getAuthenticatedUserSnapshot(
          session.user.tenantDbName,
          session.user.id,
        )
      : null;
  const t = getTranslations(userSnapshot?.settings?.language);
  const favoriteExercises = userSnapshot
    ? await listFavoriteExercises(userSnapshot.favoriteExerciseSlugs)
    : [];
  const [
    dailyReports,
    workoutSessions,
    workoutSessionsForAnalytics,
    exerciseAtlas,
    dashboardLayout,
  ] =
    session?.user?.id && session.user.tenantDbName
      ? await Promise.all([
          listDailyReports(session.user.tenantDbName, session.user.id),
          listWorkoutSessions(session.user.tenantDbName, session.user.id),
          listWorkoutSessionsForAnalytics(
            session.user.tenantDbName,
            session.user.id,
          ),
          listExerciseAtlas(),
          getResolvedDashboardLayout(
            session.user.tenantDbName,
            session.user.id,
          ),
        ])
      : [[], [], [], [], []];
  const analytics = buildDashboardAnalytics(
    dailyReports,
    workoutSessions,
    workoutSessionsForAnalytics,
    exerciseAtlas,
    userSnapshot,
  );
  const nextAction = resolveDashboardNextAction({
    dailyReports,
    userSnapshot,
    workoutSessions,
  });

  if (session?.user) {
    return (
      <DashboardHome
        analytics={analytics}
        dailyReports={dailyReports}
        dailyReportCount={dailyReports.length}
        error={resolvedSearchParams?.error}
        favoriteExercises={favoriteExercises}
        layout={dashboardLayout}
        nextAction={nextAction}
        status={resolvedSearchParams?.status}
        translations={t}
        userSnapshot={userSnapshot}
        workoutSessions={workoutSessions}
        workoutReportCount={workoutSessions.length}
      />
    );
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
      }}>
      <Stack
        spacing={2}
        sx={{
          width: 'min(100%, 720px)',
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 6,
          bgcolor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <Alert severity='info' variant='outlined'>
          {t.auth.signInDescription}
        </Alert>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Link href='/login'>
            <Button startIcon={<LoginRoundedIcon />} variant='contained'>
              {t.auth.signIn}
            </Button>
          </Link>
          <Link href='/register'>
            <Button startIcon={<AppRegistrationRoundedIcon />} variant='outlined'>
              {t.auth.createAccount}
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
