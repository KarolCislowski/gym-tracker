'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

import type { DashboardAnalytics } from '../../application/dashboard-analytics';
import { DashboardAnalyticsMobileSummaryWidget } from './dashboard-analytics-mobile-summary-widget';

const DashboardAnalyticsWidget = dynamic(
  () =>
    import('./dashboard-analytics-widget').then((module) => ({
      default: module.DashboardAnalyticsWidget,
    })),
  {
    ssr: false,
    loading: () => <AnalyticsWidgetPlaceholder />,
  },
);

interface DashboardAnalyticsLazyWidgetProps {
  analytics: DashboardAnalytics;
  translations: TranslationDictionary;
  unitSystem: UnitSystem;
}

function AnalyticsWidgetPlaceholder() {
  return (
    <Box
      sx={{
        minHeight: { xs: 640, md: 520 },
        display: 'grid',
        placeItems: 'center',
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <CircularProgress size={28} />
    </Box>
  );
}

export function DashboardAnalyticsLazyWidget({
  analytics,
  translations,
  unitSystem,
}: DashboardAnalyticsLazyWidgetProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || shouldLoad || isMobile) {
      return;
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px',
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMounted, isMobile, shouldLoad]);

  if (!hasMounted) {
    return <AnalyticsWidgetPlaceholder />;
  }

  if (isMobile) {
    return (
      <Box id='dashboard-analytics'>
        <DashboardAnalyticsMobileSummaryWidget
          analytics={analytics}
          translations={translations}
          unitSystem={unitSystem}
        />
      </Box>
    );
  }

  return (
    <Box id='dashboard-analytics' ref={containerRef}>
      {shouldLoad ? (
        <DashboardAnalyticsWidget
          analytics={analytics}
          translations={translations}
          unitSystem={unitSystem}
        />
      ) : (
        <AnalyticsWidgetPlaceholder />
      )}
    </Box>
  );
}
