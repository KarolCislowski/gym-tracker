'use client';

import type { ReactNode } from 'react';

import { AppCard } from '@/shared/ui/app-card';

interface DashboardAnalyticsCardProps {
  children: ReactNode;
  height?: 'auto' | 'hero' | 'regular';
}

/**
 * Shared chrome for analytics cards so charts and analysis states feel like one visual system.
 * @param props - Component props for the analytics card shell.
 * @param props.children - Card content.
 * @param props.height - Optional vertical rhythm token for analytics cards.
 * @returns A React element rendering a unified analytics card container.
 */
export function DashboardAnalyticsCard({
  children,
  height = 'regular',
}: DashboardAnalyticsCardProps) {
  return (
    <AppCard
      minHeight={
        height === 'hero'
          ? { xs: 300, md: 340 }
          : height === 'regular'
            ? { xs: 220, md: 240 }
            : undefined
      }
      padding='md'
      radius='lg'
      tone='standard'
    >
      {children}
    </AppCard>
  );
}
