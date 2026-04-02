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
  height: _height = 'regular',
}: DashboardAnalyticsCardProps) {
  return (
    <AppCard
      padding='md'
      radius='lg'
      tone='standard'
    >
      {children}
    </AppCard>
  );
}
