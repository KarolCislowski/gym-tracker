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
 * @param props - Component props for the authenticated application shell.
 * @param props.children - Nested page content rendered inside the shell.
 * @param props.displayName - Display name shown in the header and drawer context.
 * @param props.logoutAction - Server action used to sign the current user out.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the server-side shell wrapper.
 * @remarks This component is server-rendered and delegates interactive drawer state to `AppShellClient`.
 */
export function AppShell({
  children,
  displayName,
  logoutAction,
  translations,
}: AppShellProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        height: '100dvh',
        width: '100%',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
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
