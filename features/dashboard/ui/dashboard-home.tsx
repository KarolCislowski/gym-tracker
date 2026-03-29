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
import { DashboardGrid, DashboardGridItem } from './layout/dashboard-grid';

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
      <DashboardGrid>
        <DashboardGridItem cols={{ xs: 1, md: 6, xl: 8 }}>
          <DashboardOverviewWidget
            analytics={analytics}
            dailyReportCount={dailyReportCount}
            favoriteExerciseCount={favoriteExercises.length}
            profileName={userSnapshot?.profile?.firstName ?? null}
            translations={translations.dashboard}
            workoutReportCount={workoutReportCount}
          />
        </DashboardGridItem>

        <DashboardGridItem cols={{ xs: 1, md: 6, xl: 4 }}>
          <DashboardNextActionWidget
            action={nextAction}
            translations={translations.dashboard}
          />
        </DashboardGridItem>

        {userSnapshot?.profile ? (
          <DashboardGridItem
            cols={{ xs: 1, md: 3, xl: 4 }}
            rows={{ xs: 1, md: 1, xl: 2 }}
          >
            <DashboardProfileWidget
              profile={userSnapshot.profile}
              unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
              translations={translations}
            />
          </DashboardGridItem>
        ) : null}

        {userSnapshot?.healthyHabits ? (
          <DashboardGridItem cols={{ xs: 1, md: 3, xl: 8 }}>
            <DashboardHealthyHabitsWidget
              healthyHabits={userSnapshot.healthyHabits}
              translations={translations}
              unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
            />
          </DashboardGridItem>
        ) : null}

        <DashboardGridItem cols={{ xs: 1, md: 4, xl: 5 }}>
          <DashboardFavoriteExercisesWidget
            exercises={favoriteExercises}
            translations={translations}
          />
        </DashboardGridItem>

        {userSnapshot?.settings ? (
          <DashboardGridItem cols={{ xs: 1, md: 2, xl: 3 }}>
            <DashboardSettingsWidget
              settings={userSnapshot.settings}
              translations={translations.dashboard}
            />
          </DashboardGridItem>
        ) : null}
      </DashboardGrid>

      <DashboardAnalyticsLazyWidget
        analytics={analytics}
        translations={translations}
        unitSystem={userSnapshot?.settings?.unitSystem ?? 'metric'}
      />
    </Stack>
  );
}
