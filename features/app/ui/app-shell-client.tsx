'use client';

import { useState } from 'react';
import { Box } from '@mui/material';

import { AppOnboarding } from '@/features/onboarding/ui/app-onboarding';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { AppHeader } from './app-header';
import { AppSideDrawer } from './app-side-drawer';

interface AppShellClientProps {
  children: React.ReactNode;
  displayName: string;
  logoutAction: (formData: FormData) => Promise<void>;
  translations: TranslationDictionary;
}

/**
 * Client-side wrapper responsible only for drawer interaction state.
 * @param props - Component props for the client shell wrapper.
 * @param props.children - Nested page content rendered inside the shell layout.
 * @param props.displayName - Display name shown in the authenticated shell.
 * @param props.logoutAction - Server action used to sign the current user out.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the interactive shell layout.
 * @remarks This component owns only responsive drawer state and leaves data loading to server components.
 */
export function AppShellClient({
  children,
  displayName,
  logoutAction,
  translations,
}: AppShellClientProps) {
  const [isDesktopDrawerExpanded, setIsDesktopDrawerExpanded] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <AppOnboarding translations={translations} />
      <AppHeader
        displayName={displayName}
        logoutAction={logoutAction}
        onOpenMobileNavigation={() => setIsMobileDrawerOpen(true)}
        translations={translations}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <AppSideDrawer
          displayName={displayName}
          isDesktopExpanded={isDesktopDrawerExpanded}
          isMobileOpen={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
          onToggleDesktop={() =>
            setIsDesktopDrawerExpanded((currentValue) => !currentValue)
          }
          translations={translations}
        />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: 'auto',
            px: { xs: 2, md: 3 },
            py: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
