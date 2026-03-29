'use client';

import { Paper } from '@mui/material';
import type { ReactNode } from 'react';

type DashboardWidgetDensity = 'dense' | 'feature' | 'hero' | 'summary';

interface DashboardWidgetShellProps {
  children: ReactNode;
  density?: DashboardWidgetDensity;
  onboardingId?: string;
}

/**
 * Shared shell for dashboard widgets with consistent spacing, borders, and density tokens.
 * @param props - Component props for the widget shell.
 * @param props.children - Widget body content.
 * @param props.density - Visual density token used to tune spacing and minimum height.
 * @param props.onboardingId - Optional onboarding target id.
 * @returns A React element rendering a styled dashboard widget container.
 */
export function DashboardWidgetShell({
  children,
  density = 'feature',
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
        minHeight: getDensityMinHeight(density),
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
