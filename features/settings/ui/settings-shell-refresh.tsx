'use client';

import { useEffect, useRef } from 'react';

interface SettingsShellRefreshProps {
  shouldRefreshShell: boolean;
}

/**
 * Forces a one-time router refresh after preference updates so the shared shell
 * can pick up the latest server-side translations and theme settings.
 * @param props - Component props controlling the refresh behavior.
 * @param props.shouldRefreshShell - Whether the current route state requires a shell refresh.
 * @returns `null` because the component performs only a synchronization side effect.
 */
export function SettingsShellRefresh({
  shouldRefreshShell,
}: SettingsShellRefreshProps) {
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (!shouldRefreshShell || hasRefreshed.current) {
      return;
    }

    hasRefreshed.current = true;
    window.location.replace('/settings?status=preferences-updated');
  }, [shouldRefreshShell]);

  return null;
}
