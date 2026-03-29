import { Box, Stack } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { DashboardAnalytics } from '../application/dashboard-analytics';
import type { DashboardNextAction } from '../application/dashboard-next-action';
import { DashboardAnalyticsLazyWidget } from './widgets/dashboard-analytics-lazy-widget';
import { DashboardFavoriteExercisesWidget } from './widgets/dashboard-favorite-exercises-widget';
import { DashboardHealthyHabitsWidget } from './widgets/dashboard-healthy-habits-widget';
import { DashboardNextActionWidget } from './widgets/dashboard-next-action-widget';
import { DashboardOverviewWidget } from './widgets/dashboard-overview-widget';
import { DashboardProfileWidget } from './widgets/dashboard-profile-widget';
import { DashboardSettingsWidget } from './widgets/dashboard-settings-widget';

interface DashboardHomeProps {
  analytics: DashboardAnalytics;
  dailyReportCount: number;
  favoriteExercises: Exercise[];
  nextAction: DashboardNextAction;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
  workoutReportCount: number;
}

/**
 * Main dashboard overview content rendered inside the shared authenticated shell.
 */
export function DashboardHome({
  analytics,
  dailyReportCount,
  favoriteExercises,
  nextAction,
  translations,
  userSnapshot,
  workoutReportCount,
}: DashboardHomeProps) {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1.6fr) minmax(320px, 0.95fr)',
          },
          gap: 3,
          alignItems: 'stretch',
          '& > *': {
            minWidth: 0,
          },
        }}
      >
        <DashboardOverviewWidget
          analytics={analytics}
          dailyReportCount={dailyReportCount}
          favoriteExerciseCount={favoriteExercises.length}
          profileName={userSnapshot?.profile?.firstName ?? null}
          translations={translations.dashboard}
          workoutReportCount={workoutReportCount}
        />

        <DashboardNextActionWidget
          action={nextAction}
          translations={translations.dashboard}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'minmax(0, 1.2fr) minmax(0, 0.9fr) minmax(0, 0.9fr)',
          },
          gridTemplateRows: { xl: 'repeat(2, minmax(0, auto))' },
          gap: 3,
          '& > *': {
            minWidth: 0,
          },
        }}
      >
        {userSnapshot?.profile ? (
          <Box sx={{ gridColumn: { xl: '1 / 2' }, gridRow: { xl: '1 / 3' } }}>
            <DashboardProfileWidget
              profile={userSnapshot.profile}
              unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
              translations={translations}
            />
          </Box>
        ) : null}

        {userSnapshot?.healthyHabits ? (
          <Box sx={{ gridColumn: { xl: '2 / 4' }, gridRow: { xl: '1 / 2' } }}>
            <DashboardHealthyHabitsWidget
              healthyHabits={userSnapshot.healthyHabits}
              translations={translations}
              unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
            />
          </Box>
        ) : null}

        <Box
          sx={{
            gridColumn: { xl: '2 / 3' },
            gridRow: { xl: '2 / 3' },
            justifySelf: { xl: 'start' },
            width: '100%',
          }}
        >
          <DashboardFavoriteExercisesWidget
            exercises={favoriteExercises}
            translations={translations}
          />
        </Box>

        {userSnapshot?.settings ? (
          <Box
            sx={{
              gridColumn: { xl: '3 / 4' },
              gridRow: { xl: '2 / 3' },
              justifySelf: { xl: 'start' },
              width: '100%',
            }}
          >
            <DashboardSettingsWidget
              settings={userSnapshot.settings}
              translations={translations.dashboard}
            />
          </Box>
        ) : null}
      </Box>

      <DashboardAnalyticsLazyWidget
        analytics={analytics}
        translations={translations}
        unitSystem={userSnapshot?.settings?.unitSystem ?? 'metric'}
      />
    </Stack>
  );
}
