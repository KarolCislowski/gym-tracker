import { Box, Stack } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { Exercise } from '@/features/exercises/domain/exercise.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { DashboardFavoriteExercisesWidget } from './widgets/dashboard-favorite-exercises-widget';
import { DashboardHealthyHabitsWidget } from './widgets/dashboard-healthy-habits-widget';
import { DashboardOverviewWidget } from './widgets/dashboard-overview-widget';
import { DashboardProfileWidget } from './widgets/dashboard-profile-widget';
import { DashboardSettingsWidget } from './widgets/dashboard-settings-widget';

interface DashboardHomeProps {
  favoriteExercises: Exercise[];
  tenantDbName: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Main dashboard overview content rendered inside the shared authenticated shell.
 */
export function DashboardHome({
  favoriteExercises,
  tenantDbName,
  translations,
  userSnapshot,
}: DashboardHomeProps) {
  return (
    <Stack spacing={3}>
      <DashboardOverviewWidget
        tenantDbName={tenantDbName}
        translations={translations.dashboard}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        {userSnapshot?.profile ? (
          <DashboardProfileWidget
            profile={userSnapshot.profile}
            unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
            translations={translations}
          />
        ) : null}

        {userSnapshot?.healthyHabits ? (
          <DashboardHealthyHabitsWidget
            healthyHabits={userSnapshot.healthyHabits}
            translations={translations}
            unitSystem={userSnapshot.settings?.unitSystem ?? 'metric'}
          />
        ) : null}

        <DashboardFavoriteExercisesWidget
          exercises={favoriteExercises}
          translations={translations}
        />

        {userSnapshot?.settings ? (
          <DashboardSettingsWidget
            settings={userSnapshot.settings}
            translations={translations.dashboard}
          />
        ) : null}
      </Box>
    </Stack>
  );
}
