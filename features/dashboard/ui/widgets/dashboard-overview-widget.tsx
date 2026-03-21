import { Chip, Paper, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

interface DashboardOverviewWidgetProps {
  tenantDbName: string;
  translations: TranslationDictionary['dashboard'];
}

/**
 * Summary widget shown at the top of the dashboard.
 * @param props - Component props for the overview widget.
 * @param props.tenantDbName - The current tenant database name.
 * @param props.translations - The localized dashboard translation subset.
 * @returns A React element rendering the dashboard overview widget.
 */
export function DashboardOverviewWidget({
  tenantDbName,
  translations,
}: DashboardOverviewWidgetProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant='overline' color='text.secondary'>
          {translations.overview}
        </Typography>
        <Typography variant='h3'>{translations.welcomeBack}</Typography>
        <Typography color='text.secondary'>{translations.workspaceReady}</Typography>
        <Chip
          label={`${translations.tenantDatabase}: ${tenantDbName}`}
          color='secondary'
          variant='outlined'
          sx={{ alignSelf: 'flex-start', mt: 1 }}
        />
      </Stack>
    </Paper>
  );
}
