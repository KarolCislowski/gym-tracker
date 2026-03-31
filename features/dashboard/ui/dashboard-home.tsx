import { Stack } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { DashboardAnalytics } from '../application/dashboard-analytics';
import type { ResolvedDashboardLayoutItem } from '../domain/dashboard-layout.types';
import type { DashboardNextAction } from '../application/dashboard-next-action';
import { DashboardLayoutCustomizer } from './dashboard-layout-customizer';
import { DashboardLayoutFeedbackAlert } from './dashboard-layout-feedback-alert';
import {
  DashboardGoalComplianceAnalyticsCard,
  DashboardSummaryMetricsAnalyticsCard,
} from './widgets/dashboard-analytics-widget';
import {
  DashboardBodyMetricsAnalyticsCard,
  DashboardWellbeingAnalyticsCard,
  DashboardWorkoutVolumeAnalyticsCard,
} from './widgets/dashboard-analytics-expanded-charts';
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
  error?: string;
  favoriteExercises: Exercise[];
  layout: ResolvedDashboardLayoutItem[];
  nextAction: DashboardNextAction;
  status?: string;
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
  error,
  favoriteExercises,
  layout,
  nextAction,
  status,
  translations,
  userSnapshot,
  workoutReportCount,
}: DashboardHomeProps) {
  const visibleLayout = layout.filter((item) => item.visible);

  return (
    <Stack spacing={3}>
      <DashboardLayoutCustomizer items={layout} translations={translations.dashboard} />
      <DashboardLayoutFeedbackAlert
        error={error}
        status={status}
        translations={translations}
      />
      <DashboardGrid>
        {visibleLayout.map((item) => {
          const widget = renderDashboardWidget({
            analytics,
            dailyReportCount,
            favoriteExercises,
            item,
            nextAction,
            translations,
            userSnapshot,
            workoutReportCount,
          });

          if (!widget) {
            return null;
          }

          return (
            <DashboardGridItem key={item.widgetId} cols={item.cols} rows={item.rows}>
              {widget}
            </DashboardGridItem>
          );
        })}
      </DashboardGrid>
    </Stack>
  );
}

interface RenderDashboardWidgetArgs {
  analytics: DashboardAnalytics;
  dailyReportCount: number;
  favoriteExercises: Exercise[];
  item: ResolvedDashboardLayoutItem;
  nextAction: DashboardNextAction;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
  workoutReportCount: number;
}

function renderDashboardWidget({
  analytics,
  dailyReportCount,
  favoriteExercises,
  item,
  nextAction,
  translations,
  userSnapshot,
  workoutReportCount,
}: RenderDashboardWidgetArgs) {
  switch (item.widgetId) {
    case 'overview':
      return (
        <DashboardOverviewWidget
          analytics={analytics}
          dailyReportCount={dailyReportCount}
          favoriteExerciseCount={favoriteExercises.length}
          profileName={userSnapshot?.profile?.firstName ?? null}
          translations={translations.dashboard}
          workoutReportCount={workoutReportCount}
        />
      );
    case 'next_action':
      return (
        <DashboardNextActionWidget
          action={nextAction}
          translations={translations.dashboard}
        />
      );
    case 'profile':
      return userSnapshot?.profile ? (
        <DashboardProfileWidget
          profile={userSnapshot.profile}
          tone={item.tone}
          unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
          translations={translations}
        />
      ) : null;
    case 'healthy_habits':
      return userSnapshot?.healthyHabits ? (
        <DashboardHealthyHabitsWidget
          healthyHabits={userSnapshot.healthyHabits}
          tone={item.tone}
          translations={translations}
          unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
        />
      ) : null;
    case 'favorite_exercises':
      return (
        <DashboardFavoriteExercisesWidget
          exercises={favoriteExercises}
          tone={item.tone}
          translations={translations}
        />
      );
    case 'settings':
      return userSnapshot?.settings ? (
        <DashboardSettingsWidget
          settings={userSnapshot.settings}
          tone={item.tone}
          translations={translations.dashboard}
        />
      ) : null;
    case 'analytics_goal_compliance':
      return (
        <DashboardGoalComplianceAnalyticsCard
          analytics={analytics}
          translations={translations}
        />
      );
    case 'analytics_summary_metrics':
      return (
        <DashboardSummaryMetricsAnalyticsCard
          analytics={analytics}
          translations={translations}
        />
      );
    case 'analytics_wellbeing':
      return (
        <DashboardWellbeingAnalyticsCard
          analytics={analytics}
          translations={translations}
        />
      );
    case 'analytics_body_metrics':
      return (
        <DashboardBodyMetricsAnalyticsCard
          analytics={analytics}
          translations={translations}
          unitSystem={userSnapshot?.settings?.unitSystem ?? 'metric'}
        />
      );
    case 'analytics_workout_volume':
      return (
        <DashboardWorkoutVolumeAnalyticsCard
          analytics={analytics}
          translations={translations}
        />
      );
  }
}
