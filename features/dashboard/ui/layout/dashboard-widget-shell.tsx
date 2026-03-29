'use client';

import { Paper } from '@mui/material';
import type { ReactNode } from 'react';

type DashboardWidgetDensity = 'dense' | 'feature' | 'hero' | 'summary';
type DashboardWidgetHeight = 'auto' | 'compact' | 'regular' | 'tall' | 'hero';

interface DashboardWidgetShellProps {
  children: ReactNode;
  density?: DashboardWidgetDensity;
  height?: DashboardWidgetHeight;
  onboardingId?: string;
}

/**
 * Shared shell for dashboard widgets with consistent spacing, borders, and density tokens.
 * @param props - Component props for the widget shell.
 * @param props.children - Widget body content.
 * @param props.density - Visual density token used to tune spacing and minimum height.
 * @param props.height - Height token used to keep dashboard widgets on a shared vertical rhythm.
 * @param props.onboardingId - Optional onboarding target id.
 * @returns A React element rendering a styled dashboard widget container.
 */
export function DashboardWidgetShell({
  children,
  density = 'feature',
  height = 'auto',
  onboardingId,
}: DashboardWidgetShellProps) {
  return (
    <Paper
      data-onboarding={onboardingId}
      elevation={0}
      sx={{
        p: getDensityPadding(density),
        border: 1,
        borderColor: 'divider',
        borderRadius: getDensityRadius(density),
        minHeight: getWidgetMinHeight(height, density),
        minWidth: 0,
        width: '100%',
        alignSelf: 'stretch',
      }}
    >
      {children}
    </Paper>
  );
}

function getDensityPadding(density: DashboardWidgetDensity) {
  switch (density) {
    case 'hero':
      return { xs: 3, md: 4 };
    case 'summary':
      return 3;
    case 'dense':
      return 2.5;
    case 'feature':
    default:
      return 3;
  }
}

function getDensityRadius(density: DashboardWidgetDensity) {
  switch (density) {
    case 'hero':
    case 'summary':
      return 8;
    case 'dense':
      return 5;
    case 'feature':
    default:
      return 6;
  }
}

function getDensityMinHeight(density: DashboardWidgetDensity) {
  switch (density) {
    case 'hero':
      return { xs: 280, md: 320 };
    case 'summary':
      return 280;
    case 'dense':
      return 180;
    case 'feature':
    default:
      return 240;
  }
}

function getWidgetMinHeight(
  height: DashboardWidgetHeight,
  density: DashboardWidgetDensity,
) {
  switch (height) {
    case 'compact':
      return 180;
    case 'regular':
      return { xs: 220, md: 240 };
    case 'tall':
      return { xs: 260, md: 320 };
    case 'hero':
      return { xs: 300, md: 340 };
    case 'auto':
    default:
      return getDensityMinHeight(density);
  }
}
