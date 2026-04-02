'use client';

import type { ReactNode } from 'react';

import { Box } from '@mui/material';
import { Masonry } from 'masonic';

interface DashboardMasonryLayoutProps {
  featuredItems: ReactNode[];
  items: Array<{
    content: ReactNode;
    id: string;
  }>;
}

/**
 * Dashboard layout that keeps pinned hero widgets in a stable top section and flows the rest with masonry packing.
 * @param props - Component props for the masonry dashboard layout.
 * @param props.featuredItems - Pinned widgets that should remain visually stable at the top.
 * @param props.items - Reorderable dashboard widgets rendered in the masonry section.
 * @returns A React element rendering a hybrid featured + masonry dashboard layout.
 */
export function DashboardMasonryLayout({
  featuredItems,
  items,
}: DashboardMasonryLayoutProps) {
  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {featuredItems.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'repeat(2, minmax(0, 1fr))',
            },
            alignItems: 'stretch',
            '& > *': {
              minWidth: 0,
            },
          }}
        >
          {featuredItems.map((item, index) => (
            <Box key={index} sx={{ minWidth: 0 }}>
              {item}
            </Box>
          ))}
        </Box>
      ) : null}

      {items.length > 0 ? (
        <Masonry
          columnGutter={24}
          columnWidth={360}
          itemKey={(item) => item.id}
          items={items}
          maxColumnCount={3}
          overscanBy={2}
          render={DashboardMasonryCard}
          rowGutter={24}
          ssrHeight={1400}
          ssrWidth={1280}
        />
      ) : null}
    </Box>
  );
}

function DashboardMasonryCard({
  data,
}: {
  data: {
    content: ReactNode;
    id: string;
  };
}) {
  return <Box sx={{ minWidth: 0 }}>{data.content}</Box>;
}
