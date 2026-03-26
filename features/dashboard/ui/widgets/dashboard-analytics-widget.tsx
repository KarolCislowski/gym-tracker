'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

import type {
  DashboardAnalytics,
  GoalComplianceChartPoint,
} from '../../application/dashboard-analytics';
import {
  resolveAnalyticsStateMessage,
  resolveGoalComplianceState,
} from '../../application/dashboard-analytics-state';

interface DashboardAnalyticsWidgetProps {
  analytics: DashboardAnalytics;
  translations: TranslationDictionary;
  unitSystem: UnitSystem;
}

const MOBILE_GOAL_COMPLIANCE_DAYS = 7;

const DashboardAnalyticsExpandedCharts = dynamic(
  () =>
    import('./dashboard-analytics-expanded-charts').then((module) => ({
      default: module.DashboardAnalyticsExpandedCharts,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

/**
 * Dashboard analytics section rendering the four MVP charts for compliance, wellbeing, body metrics, and workout volume.
 * @param props - Component props for the analytics widget group.
 * @param props.analytics - Precomputed dashboard analytics series.
 * @param props.translations - Translation dictionary for localized chart titles and labels.
 * @returns A React element rendering the chart grid.
 */
export function DashboardAnalyticsWidget({
  analytics,
  translations,
  unitSystem,
}: DashboardAnalyticsWidgetProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const t = translations.dashboard;
  const goalCompliancePoints = isMobile
    ? analytics.goalCompliance.slice(-MOBILE_GOAL_COMPLIANCE_DAYS)
    : analytics.goalCompliance;
  const goalComplianceState = resolveGoalComplianceState(goalCompliancePoints);
  const [showExpandedCharts, setShowExpandedCharts] = useState(!isMobile);

  return (
    <Stack
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
        gap: 3,
        '& > *': {
          minWidth: 0,
        },
      }}
    >
      <ChartCard title={t.goalComplianceChart}>
        {goalComplianceState === 'ready' ? (
          <GoalComplianceHeatmap
            compact={isMobile}
            points={goalCompliancePoints}
            translations={translations}
          />
        ) : (
          <EmptyChartState message={resolveAnalyticsStateMessage(goalComplianceState, t)} />
        )}
      </ChartCard>
      {showExpandedCharts ? (
        <DashboardAnalyticsExpandedCharts
          analytics={analytics}
          isMobile={isMobile}
          translations={translations}
          unitSystem={unitSystem}
        />
      ) : (
        <ChartCard title={t.showAllLabel}>
          <Stack alignItems='flex-start' spacing={2}>
            <Button
              onClick={() => setShowExpandedCharts(true)}
              size='small'
              variant='outlined'
            >
              {t.showAllLabel}
            </Button>
          </Stack>
        </ChartCard>
      )}
    </Stack>
  );
}

function GoalComplianceHeatmap({
  compact = false,
  points,
  translations,
}: {
  compact?: boolean;
  points: GoalComplianceChartPoint[];
  translations: TranslationDictionary;
}) {
  const dashboardT = translations.dashboard;
  const habitsT = translations.healthyHabits;
  const dailyT = translations.dailyReports;
  const exerciseT = translations.exercises;
  const rows = [
    { key: 'sleep', label: dailyT.columnSleepGoal },
    { key: 'steps', label: habitsT.stepsPerDayLabel },
    { key: 'water', label: habitsT.waterPerDayLabel },
    { key: 'protein', label: habitsT.proteinPerDayLabel },
    { key: 'cardio', label: habitsT.cardioMinutesPerWeekLabel },
  ] as const;
  const stickyColumnWidth = compact ? 120 : 148;
  const dayColumnWidth = compact ? 48 : 56;

  return (
    <Stack spacing={2}>
      <Stack direction='row' flexWrap='wrap' gap={compact ? 1.5 : 2}>
        <HeatmapLegendItem
          color='success.main'
          label={exerciseT.yesLabel}
        />
        <HeatmapLegendItem
          color='action.selected'
          label={exerciseT.noLabel}
        />
      </Stack>

      <TableContainer
        sx={{
          overflowX: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 4,
        }}
      >
        <Table aria-label={dashboardT.goalComplianceChart} size='small'>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  minWidth: stickyColumnWidth,
                }}
              >
                <Typography variant='body2' fontWeight={600}>
                  {dashboardT.goalComplianceChart}
                </Typography>
              </TableCell>
              {points.map((point) => (
                <TableCell
                  align='center'
                  key={point.label}
                  sx={{ minWidth: dayColumnWidth, whiteSpace: 'nowrap' }}
                >
                  {point.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell
                  component='th'
                  scope='row'
                  sx={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    backgroundColor: 'background.paper',
                    minWidth: stickyColumnWidth,
                  }}
                >
                  {row.label}
                </TableCell>
                {points.map((point) => {
                  const value = point[row.key];
                  const isMet = value === 1;
                  const statusLabel = isMet
                    ? exerciseT.yesLabel
                    : exerciseT.noLabel;

                  return (
                    <TableCell align='center' key={`${row.key}-${point.label}`}>
                      <Box
                        component='span'
                        sx={{
                          position: 'absolute',
                          width: 1,
                          height: 1,
                          p: 0,
                          m: -1,
                          overflow: 'hidden',
                          clip: 'rect(0 0 0 0)',
                          whiteSpace: 'nowrap',
                          border: 0,
                        }}
                      >
                        {`${row.label}, ${point.label}: ${statusLabel}`}
                      </Box>
                      <Box
                        aria-hidden
                        title={`${row.label}, ${point.label}: ${statusLabel}`}
                        sx={{
                          width: 20,
                          height: 20,
                          mx: 'auto',
                          borderRadius: 1.5,
                          border: 1,
                          borderColor: isMet ? 'success.main' : 'divider',
                          backgroundColor: isMet
                            ? 'success.main'
                            : 'action.selected',
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

function HeatmapLegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <Stack alignItems='center' direction='row' spacing={1}>
      <Box
        aria-hidden
        sx={{
          width: 14,
          height: 14,
          borderRadius: 1,
          backgroundColor: color,
          border: 1,
          borderColor: 'divider',
        }}
      />
      <Typography color='text.secondary' variant='body2'>
        {label}
      </Typography>
    </Stack>
  );
}

function ChartCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
        minWidth: 0,
      }}
    >
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Typography component='h2' variant='h6'>
          {title}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <Typography color='text.secondary' variant='body2'>
      {message}
    </Typography>
  );
}
