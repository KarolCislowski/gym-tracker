'use client';

import { Paper } from '@mui/material';
import type { ReactNode } from 'react';

import type { DashboardWidgetTone } from '../../application/dashboard-widget-registry';

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
  height = 'auto',
  onboardingId,
  tone = 'neutral',
}: DashboardWidgetShellProps) {
  return (
    <Paper
      data-onboarding={onboardingId}
      elevation={0}
      sx={(theme) => {
        const chrome = getWidgetChrome(theme.palette.mode, tone);

        return {
          position: 'relative',
          overflow: 'hidden',
          p: getDensityPadding(density),
          border: 1,
          borderColor: chrome.borderColor,
          borderRadius: getDensityRadius(density),
          minHeight: getWidgetMinHeight(height, density),
          minWidth: 0,
          width: '100%',
          alignSelf: 'stretch',
          bgcolor: chrome.backgroundColor,
          backgroundImage: chrome.backgroundImage,
          boxShadow: chrome.boxShadow,
          backdropFilter: chrome.backdropFilter,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: chrome.overlay,
            opacity: theme.palette.mode === 'dark' ? 0.9 : 1,
          },
          '& > *': {
            position: 'relative',
            zIndex: 1,
          },
        };
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

function getWidgetChrome(
  mode: 'dark' | 'light',
  tone: DashboardWidgetTone,
) {
  switch (tone) {
    case 'accent':
      return {
        backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.92)' : '#eef6ff',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(155deg, rgba(59,130,246,0.18), rgba(15,23,42,0.96) 58%, rgba(14,165,233,0.12))'
            : 'linear-gradient(155deg, rgba(255,255,255,0.96), rgba(219,234,254,0.96) 50%, rgba(186,230,253,0.92))',
        borderColor: mode === 'dark' ? 'rgba(96, 165, 250, 0.22)' : 'rgba(59, 130, 246, 0.26)',
        boxShadow:
          mode === 'dark'
            ? '0 22px 60px rgba(2, 6, 23, 0.46)'
            : '0 20px 44px rgba(59, 130, 246, 0.12)',
        backdropFilter: 'blur(18px)',
        overlay:
          mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(125,211,252,0.16), transparent 38%), radial-gradient(circle at bottom left, rgba(59,130,246,0.12), transparent 42%)'
            : 'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 36%), radial-gradient(circle at bottom left, rgba(59,130,246,0.14), transparent 40%)',
      };
    case 'soft':
      return {
        backgroundColor: mode === 'dark' ? 'rgba(17, 24, 39, 0.92)' : '#f8fafc',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(17,24,39,0.98), rgba(15,23,42,0.92))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,245,249,0.98))',
        borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.16)' : 'rgba(148, 163, 184, 0.22)',
        boxShadow:
          mode === 'dark'
            ? '0 18px 42px rgba(2, 6, 23, 0.34)'
            : '0 16px 34px rgba(100, 116, 139, 0.1)',
        backdropFilter: 'blur(12px)',
        overlay:
          mode === 'dark'
            ? 'radial-gradient(circle at top left, rgba(148,163,184,0.10), transparent 32%)'
            : 'radial-gradient(circle at top left, rgba(255,255,255,0.4), transparent 30%)',
      };
    case 'glass':
      return {
        backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.76)' : 'rgba(248, 250, 252, 0.84)',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(30,41,59,0.84), rgba(15,23,42,0.76))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(241,245,249,0.78))',
        borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.22)',
        boxShadow:
          mode === 'dark'
            ? '0 16px 40px rgba(2, 6, 23, 0.36)'
            : '0 18px 40px rgba(148, 163, 184, 0.14)',
        backdropFilter: 'blur(20px)',
        overlay:
          mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 28%)'
            : 'radial-gradient(circle at top right, rgba(255,255,255,0.35), transparent 28%)',
      };
    case 'neutral':
    default:
      return {
        backgroundColor: mode === 'dark' ? 'rgba(17, 24, 39, 0.9)' : '#ffffff',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(17,24,39,0.96), rgba(17,24,39,0.9))'
            : 'linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,0.96))',
        borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.14)' : 'rgba(148, 163, 184, 0.18)',
        boxShadow:
          mode === 'dark'
            ? '0 14px 32px rgba(2, 6, 23, 0.3)'
            : '0 12px 30px rgba(148, 163, 184, 0.08)',
        backdropFilter: 'blur(8px)',
        overlay:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent 22%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.28), transparent 24%)',
      };
  }
}
