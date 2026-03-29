import { Box } from '@mui/material';
import type { ReactNode } from 'react';

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
        '& > *': {
          minWidth: 0,
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
  return (
    <Box
      sx={{
        gridColumn: resolveGridSpan(cols),
        gridRow: resolveGridSpan(rows),
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  );
}

function resolveGridSpan(span: number | BreakpointSpan) {
  if (typeof span === 'number') {
    return `span ${span} / span ${span}`;
  }

  return {
    xs: `span ${span.xs ?? 1} / span ${span.xs ?? 1}`,
    md: `span ${span.md ?? span.xs ?? 1} / span ${span.md ?? span.xs ?? 1}`,
    xl: `span ${span.xl ?? span.md ?? span.xs ?? 1} / span ${span.xl ?? span.md ?? span.xs ?? 1}`,
  };
}
