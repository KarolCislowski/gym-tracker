'use client';

import { Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';

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
    <Paper
      elevation={0}
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        p: 3,
        border: 1,
        borderColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.08)
            : alpha(theme.palette.primary.main, 0.14),
        borderRadius: 6,
        minWidth: 0,
        minHeight:
          height === 'hero'
            ? { xs: 300, md: 340 }
            : height === 'regular'
              ? { xs: 220, md: 240 }
              : undefined,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.82)'
            : '#f7fbff',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(30,41,59,0.86), rgba(15,23,42,0.8))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(239,246,255,0.92))',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 18px 42px rgba(2, 6, 23, 0.36)'
            : '0 18px 38px rgba(59, 130, 246, 0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 36%), radial-gradient(circle at bottom left, rgba(59,130,246,0.08), transparent 42%)'
              : 'radial-gradient(circle at top right, rgba(125,211,252,0.16), transparent 34%), radial-gradient(circle at bottom left, rgba(191,219,254,0.18), transparent 40%)',
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
      })}
    >
      {children}
    </Paper>
  );
}
