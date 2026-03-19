'use client';

import { useState } from 'react';
import { Box } from '@mui/material';

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
    <>
      <AppHeader
        displayName={displayName}
        logoutAction={logoutAction}
        onOpenMobileNavigation={() => setIsMobileDrawerOpen(true)}
        translations={translations}
      />
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
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
            px: { xs: 2, md: 3 },
            py: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
