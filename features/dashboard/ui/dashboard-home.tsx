import { Box, Stack } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { DashboardOverviewWidget } from './widgets/dashboard-overview-widget';
import { DashboardProfileWidget } from './widgets/dashboard-profile-widget';
import { DashboardSettingsWidget } from './widgets/dashboard-settings-widget';

interface DashboardHomeProps {
  tenantDbName: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Main dashboard overview content rendered inside the shared authenticated shell.
 */
export function DashboardHome({
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
            translations={translations}
          />
        ) : null}

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
