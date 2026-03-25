import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';

import { auth } from '@/auth';
import { AppShell } from '@/features/app/ui/app-shell';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { logoutAction } from '@/features/auth/infrastructure/auth.actions';
import { getTranslations } from '@/shared/i18n/application/i18n.service';
import {
  COLOR_MODE_COOKIE_NAME,
  getColorModeFromSettings,
  resolveAppColorMode,
} from '@/shared/theme/application/theme-mode';
import { AppThemeProvider } from '@/shared/theme/app-theme-provider';

import './globals.css';
import 'driver.js/dist/driver.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gym Tracker',
  description: 'Multi-tenant gym tracking application with Auth.js login.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const cookieStore = await cookies();
  const guestMode = resolveAppColorMode(
    cookieStore.get(COLOR_MODE_COOKIE_NAME)?.value,
  );
  const userSnapshot =
    session?.user?.id && session.user.tenantDbName
      ? await getAuthenticatedUserSnapshot(
          session.user.tenantDbName,
          session.user.id,
        )
      : null;
  const mode = userSnapshot?.settings
    ? getColorModeFromSettings(userSnapshot.settings.isDarkMode)
    : guestMode;
  const translations = getTranslations(userSnapshot?.settings?.language);
  const displayName = userSnapshot?.profile
    ? `${userSnapshot.profile.firstName} ${userSnapshot.profile.lastName}`
    : session?.user?.email ?? translations.dashboard.appName;

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppThemeProvider mode={mode}>
          <Box sx={{ width: '100vw' }}>
            {session?.user ? (
              <AppShell
                displayName={displayName}
                logoutAction={logoutAction}
                translations={translations}
              >
                {children}
              </AppShell>
            ) : (
              children
            )}
          </Box>
        </AppThemeProvider>
      </body>
    </html>
  );
}
