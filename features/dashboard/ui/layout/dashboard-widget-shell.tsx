'use client';

import type { ReactNode } from 'react';

import type { DashboardWidgetTone } from '../../application/dashboard-widget-registry';
import { AppCard } from '@/shared/ui/app-card';

type DashboardWidgetDensity = 'dense' | 'feature' | 'hero' | 'summary';
type DashboardWidgetHeight = 'auto' | 'compact' | 'regular' | 'tall' | 'hero';

interface DashboardWidgetShellProps {
  children: ReactNode;
  density?: DashboardWidgetDensity;
  height?: DashboardWidgetHeight;
  onboardingId?: string;
  tone?: DashboardWidgetTone;
}

/**
 * Shared shell for dashboard widgets with consistent spacing, borders, and density tokens.
 * @param props - Component props for the widget shell.
 * @param props.children - Widget body content.
 * @param props.density - Visual density token used to tune spacing and minimum height.
 * @param props.height - Height token used to keep dashboard widgets on a shared vertical rhythm.
 * @param props.onboardingId - Optional onboarding target id.
 * @param props.tone - Visual tone token used to differentiate widget chrome and atmosphere.
 * @returns A React element rendering a styled dashboard widget container.
 */
export function DashboardWidgetShell({
  children,
  density = 'feature',
  height: _height = 'auto',
  onboardingId,
  tone: _tone = 'neutral',
}: DashboardWidgetShellProps) {
  return (
    <AppCard
      onboardingId={onboardingId}
      padding={getDensityPadding(density)}
      radius={getDensityRadius(density)}
      tone='standard'
    >
      {children}
    </AppCard>
  );
}

function getDensityPadding(density: DashboardWidgetDensity) {
  switch (density) {
    case 'hero':
      return 'lg';
    case 'summary':
      return 'md';
    case 'dense':
      return 'sm';
    case 'feature':
    default:
      return 'md';
  }
}

function getDensityRadius(density: DashboardWidgetDensity) {
  switch (density) {
    case 'hero':
    case 'summary':
      return 'xl';
    case 'dense':
      return 'md';
    case 'feature':
    default:
      return 'lg';
  }
}
