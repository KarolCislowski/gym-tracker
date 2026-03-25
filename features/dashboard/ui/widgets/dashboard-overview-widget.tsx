import { Paper, Stack, Typography } from '@mui/material';

import { OnboardingReplayButton } from '@/features/onboarding/ui/onboarding-replay-button';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardOverviewWidgetProps {
  translations: TranslationDictionary['dashboard'];
}

/**
 * Summary widget shown at the top of the dashboard.
 * @param props - Component props for the overview widget.
 * @param props.translations - The localized dashboard translation subset.
 * @returns A React element rendering the dashboard overview widget.
 */
export function DashboardOverviewWidget({
  translations,
}: DashboardOverviewWidgetProps) {
  return (
    <Paper
      data-onboarding='dashboard-overview'
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          spacing={1.5}
        >
          <Typography variant='overline' color='text.secondary'>
            {translations.overview}
          </Typography>
          <OnboardingReplayButton label={translations.replayOnboarding} />
        </Stack>
        <Typography component='h1' variant='h3'>
          {translations.welcomeBack}
        </Typography>
        <Typography color='text.secondary'>{translations.workspaceReady}</Typography>
      </Stack>
    </Paper>
  );
}
