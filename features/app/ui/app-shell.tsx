import { Box } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { AppShellClient } from './app-shell-client';

interface AppShellProps {
  children: React.ReactNode;
  displayName: string;
  logoutAction: (formData: FormData) => Promise<void>;
  translations: TranslationDictionary;
}

/**
 * Shared authenticated application shell that wraps dashboard pages.
 */
export function AppShell({
  children,
  displayName,
  logoutAction,
  translations,
}: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppShellClient
        displayName={displayName}
        logoutAction={logoutAction}
        translations={translations}
      >
        {children}
      </AppShellClient>
    </Box>
  );
}
