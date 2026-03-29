'use client';

import { Paper } from '@mui/material';
import type { ReactNode } from 'react';

export type AppCardTone =
  | 'accent'
  | 'analytics'
  | 'glass'
  | 'neutral'
  | 'standard'
  | 'soft';

export type AppCardPadding = 'lg' | 'md' | 'sm';
export type AppCardRadius = 'lg' | 'md' | 'xl';

interface AppCardProps {
  children?: ReactNode;
  minHeight?: number | { md?: number; xs?: number };
  onboardingId?: string;
  padding?: AppCardPadding;
  radius?: AppCardRadius;
  tone?: AppCardTone;
}

/**
 * Shared card surface used across the app to provide a consistent default chrome for sections and widgets.
 * @param props - Component props for the shared app card.
 * @param props.children - Card content.
 * @param props.minHeight - Optional responsive minimum height token.
 * @param props.onboardingId - Optional onboarding target id.
 * @param props.padding - Internal spacing preset.
 * @param props.radius - Corner radius preset.
 * @param props.tone - Visual tone preset controlling background, border, and atmospheric overlays.
 * @returns A React element rendering the shared card surface.
 */
export function AppCard({
  children,
  minHeight,
  onboardingId,
  padding = 'md',
  radius = 'md',
  tone = 'neutral',
}: AppCardProps) {
  return (
    <Paper
      data-onboarding={onboardingId}
      elevation={0}
      sx={(theme) => {
        const chrome = getAppCardChrome(theme.palette.mode, tone);

        return {
          position: 'relative',
          overflow: 'hidden',
          p: getAppCardPadding(padding),
          border: 1,
          borderColor: chrome.borderColor,
          borderRadius: getAppCardRadius(radius),
          minHeight,
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

function getAppCardPadding(padding: AppCardPadding) {
  switch (padding) {
    case 'lg':
      return { xs: 3, md: 4 };
    case 'sm':
      return 2.5;
    case 'md':
    default:
      return 3;
  }
}

function getAppCardRadius(radius: AppCardRadius) {
  switch (radius) {
    case 'xl':
      return 8;
    case 'lg':
      return 6;
    case 'md':
    default:
      return 5;
  }
}

function getAppCardChrome(
  mode: 'dark' | 'light',
  tone: AppCardTone,
) {
  switch (tone) {
    case 'analytics':
      return {
        backgroundColor:
          mode === 'dark' ? 'rgba(15, 23, 42, 0.82)' : '#f8fbff',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(30,41,59,0.86), rgba(15,23,42,0.8))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,247,255,0.94))',
        borderColor:
          mode === 'dark'
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(148,163,184,0.18)',
        boxShadow:
          mode === 'dark'
            ? '0 18px 42px rgba(2, 6, 23, 0.36)'
            : '0 16px 34px rgba(148, 163, 184, 0.1)',
        backdropFilter: 'blur(14px)',
        overlay:
          mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 36%), radial-gradient(circle at bottom left, rgba(59,130,246,0.08), transparent 42%)'
            : 'radial-gradient(circle at top right, rgba(125,211,252,0.12), transparent 34%), radial-gradient(circle at bottom left, rgba(191,219,254,0.14), transparent 40%)',
      };
    case 'accent':
      return {
        backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.92)' : '#f4f9ff',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(155deg, rgba(59,130,246,0.18), rgba(15,23,42,0.96) 58%, rgba(14,165,233,0.12))'
            : 'linear-gradient(155deg, rgba(255,255,255,0.98), rgba(232,242,255,0.96) 52%, rgba(214,236,255,0.94))',
        borderColor:
          mode === 'dark'
            ? 'rgba(96,165,250,0.22)'
            : 'rgba(96,165,250,0.2)',
        boxShadow:
          mode === 'dark'
            ? '0 22px 60px rgba(2, 6, 23, 0.46)'
            : '0 16px 36px rgba(96, 165, 250, 0.1)',
        backdropFilter: 'blur(18px)',
        overlay:
          mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(125,211,252,0.16), transparent 38%), radial-gradient(circle at bottom left, rgba(59,130,246,0.12), transparent 42%)'
            : 'radial-gradient(circle at top right, rgba(125,211,252,0.14), transparent 36%), radial-gradient(circle at bottom left, rgba(96,165,250,0.1), transparent 40%)',
      };
    case 'soft':
      return {
        backgroundColor: mode === 'dark' ? 'rgba(17, 24, 39, 0.92)' : '#fbfcfe',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(17,24,39,0.98), rgba(15,23,42,0.92))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.99), rgba(246,249,252,0.98))',
        borderColor:
          mode === 'dark'
            ? 'rgba(148,163,184,0.16)'
            : 'rgba(148,163,184,0.18)',
        boxShadow:
          mode === 'dark'
            ? '0 18px 42px rgba(2, 6, 23, 0.34)'
            : '0 14px 30px rgba(148, 163, 184, 0.08)',
        backdropFilter: 'blur(12px)',
        overlay:
          mode === 'dark'
            ? 'radial-gradient(circle at top left, rgba(148,163,184,0.10), transparent 32%)'
            : 'radial-gradient(circle at top left, rgba(255,255,255,0.3), transparent 30%)',
      };
    case 'standard':
      return {
        backgroundColor:
          mode === 'dark' ? 'rgba(17, 24, 39, 0.9)' : '#f4f8ff',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(17,24,39,0.96), rgba(17,24,39,0.9))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.99), rgba(235,243,255,0.98))',
        borderColor:
          mode === 'dark'
            ? 'rgba(148,163,184,0.14)'
            : 'rgba(96,165,250,0.24)',
        boxShadow:
          mode === 'dark'
            ? '0 14px 32px rgba(2, 6, 23, 0.3)'
            : '0 16px 34px rgba(96, 165, 250, 0.12)',
        backdropFilter: 'blur(10px)',
        overlay:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent 22%)'
            : 'radial-gradient(circle at top right, rgba(191,219,254,0.18), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.22), transparent 24%)',
      };
    case 'glass':
      return {
        backgroundColor:
          mode === 'dark' ? 'rgba(15, 23, 42, 0.76)' : 'rgba(250, 252, 255, 0.88)',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(30,41,59,0.84), rgba(15,23,42,0.76))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(245,248,252,0.82))',
        borderColor:
          mode === 'dark'
            ? 'rgba(148,163,184,0.18)'
            : 'rgba(148,163,184,0.18)',
        boxShadow:
          mode === 'dark'
            ? '0 16px 40px rgba(2, 6, 23, 0.36)'
            : '0 16px 32px rgba(148, 163, 184, 0.1)',
        backdropFilter: 'blur(20px)',
        overlay:
          mode === 'dark'
            ? 'radial-gradient(circle at top right, rgba(255,255,255,0.06), transparent 28%)'
            : 'radial-gradient(circle at top right, rgba(255,255,255,0.28), transparent 28%)',
      };
    case 'neutral':
    default:
      return {
        backgroundColor: mode === 'dark' ? 'rgba(17, 24, 39, 0.9)' : '#ffffff',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(180deg, rgba(17,24,39,0.96), rgba(17,24,39,0.9))'
            : 'linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,0.96))',
        borderColor:
          mode === 'dark'
            ? 'rgba(148,163,184,0.14)'
            : 'rgba(148,163,184,0.18)',
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
