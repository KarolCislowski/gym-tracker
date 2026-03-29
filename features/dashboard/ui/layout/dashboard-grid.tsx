import { Box } from '@mui/material';
import type { CSSProperties, ReactNode } from 'react';

type BreakpointSpan = {
  md?: number;
  xl?: number;
  xs?: number;
};

interface DashboardGridProps {
  children: ReactNode;
}

interface DashboardGridItemProps {
  children: ReactNode;
  cols: number | BreakpointSpan;
  rows?: number | BreakpointSpan;
}

/**
 * Responsive 12-column dashboard grid used to compose mosaic-style widget layouts.
 * @param props - Component props for the dashboard grid.
 * @param props.children - Grid items rendered inside the layout.
 * @returns A React element rendering the dashboard mosaic grid.
 */
export function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'repeat(6, minmax(0, 1fr))',
          xl: 'repeat(12, minmax(0, 1fr))',
        },
        gridAutoFlow: 'dense',
        gridAutoRows: 'minmax(120px, auto)',
        gap: 3,
        '& > [data-dashboard-grid-item]': {
          minWidth: 0,
          gridColumn:
            'span var(--dashboard-cols-xs) / span var(--dashboard-cols-xs)',
          gridRow:
            'span var(--dashboard-rows-xs) / span var(--dashboard-rows-xs)',
        },
        '@media (min-width: 900px)': {
          '& > [data-dashboard-grid-item]': {
            gridColumn:
              'span var(--dashboard-cols-md) / span var(--dashboard-cols-md)',
            gridRow:
              'span var(--dashboard-rows-md) / span var(--dashboard-rows-md)',
          },
        },
        '@media (min-width: 1536px)': {
          '& > [data-dashboard-grid-item]': {
            gridColumn:
              'span var(--dashboard-cols-xl) / span var(--dashboard-cols-xl)',
            gridRow:
              'span var(--dashboard-rows-xl) / span var(--dashboard-rows-xl)',
          },
        },
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Dashboard grid item with responsive column and optional row span.
 * @param props - Component props for the grid item.
 * @param props.cols - Responsive column span across the dashboard grid.
 * @param props.rows - Optional responsive row span.
 * @param props.children - Widget content rendered inside the grid slot.
 * @returns A React element rendering the positioned dashboard grid item.
 */
export function DashboardGridItem({
  children,
  cols,
  rows = 1,
}: DashboardGridItemProps) {
  const resolvedCols = resolveResponsiveSpan(cols);
  const resolvedRows = resolveResponsiveSpan(rows);

  return (
    <div
      data-dashboard-grid-item='true'
      style={
        {
          '--dashboard-cols-xs': String(resolvedCols.xs),
          '--dashboard-cols-md': String(resolvedCols.md),
          '--dashboard-cols-xl': String(resolvedCols.xl),
          '--dashboard-rows-xs': String(resolvedRows.xs),
          '--dashboard-rows-md': String(resolvedRows.md),
          '--dashboard-rows-xl': String(resolvedRows.xl),
          minWidth: 0,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

function resolveResponsiveSpan(span: number | BreakpointSpan) {
  if (typeof span === 'number') {
    return { xs: span, md: span, xl: span };
  }

  return {
    xs: span.xs ?? 1,
    md: span.md ?? span.xs ?? 1,
    xl: span.xl ?? span.md ?? span.xs ?? 1,
  };
}
