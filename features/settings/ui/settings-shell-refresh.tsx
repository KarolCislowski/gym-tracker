'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const hasRefreshed = useRef(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!shouldRefreshShell || hasRefreshed.current) {
      return;
    }

    hasRefreshed.current = true;

    startTransition(() => {
      router.replace('/settings?status=preferences-updated');
      router.refresh();
    });
  }, [router, shouldRefreshShell, startTransition]);

  return null;
}
