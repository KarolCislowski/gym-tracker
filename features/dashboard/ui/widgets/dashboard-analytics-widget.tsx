'use client';

import { BarChart, LineChart } from '@mui/x-charts';
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  DashboardAnalytics,
  GoalComplianceChartPoint,
} from '../../application/dashboard-analytics';

interface DashboardAnalyticsWidgetProps {
  analytics: DashboardAnalytics;
  translations: TranslationDictionary;
}

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
}: DashboardAnalyticsWidgetProps) {
  const t = translations.dashboard;
  const habitsT = translations.healthyHabits;
  const dailyT = translations.dailyReports;

  return (
    <Stack
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
        gap: 3,
      }}
    >
      <ChartCard title={t.goalComplianceChart}>
        {analytics.goalCompliance.length ? (
          <GoalComplianceHeatmap
            points={analytics.goalCompliance}
            translations={translations}
          />
        ) : (
          <EmptyChartState message={t.noChartData} />
        )}
      </ChartCard>

      <ChartCard title={t.wellbeingChart}>
        {analytics.wellbeing.length ? (
          <LineChart
            dataset={analytics.wellbeing}
            height={280}
            series={[
              { dataKey: 'mood', label: dailyT.columnMood },
              { dataKey: 'energy', label: dailyT.columnEnergy },
              { dataKey: 'stress', label: dailyT.columnStress },
              { dataKey: 'recovery', label: dailyT.columnRecovery },
            ]}
            skipAnimation
            xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
            yAxis={[{ min: 0, max: 5 }]}
          />
        ) : (
          <EmptyChartState message={t.noChartData} />
        )}
      </ChartCard>

      <ChartCard title={t.bodyMetricsChart}>
        {analytics.bodyMetrics.some(
          (point) =>
            point.bodyWeightKg != null || point.restingHeartRate != null,
        ) ? (
          <Stack spacing={2}>
            <LineChart
              dataset={analytics.bodyMetrics}
              height={220}
              series={[{ dataKey: 'bodyWeightKg', label: dailyT.bodyWeightLabel }]}
              skipAnimation
              xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
            />
            <LineChart
              dataset={analytics.bodyMetrics}
              height={220}
              series={[{ dataKey: 'restingHeartRate', label: dailyT.restingHeartRateLabel }]}
              skipAnimation
              xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
            />
          </Stack>
        ) : (
          <EmptyChartState message={t.noChartData} />
        )}
      </ChartCard>

      <ChartCard title={t.workoutVolumeChart}>
        {analytics.workoutVolume.length ? (
          <BarChart
            dataset={analytics.workoutVolume}
            height={280}
            series={[
              { dataKey: 'sessions', label: t.chartSessions },
              { dataKey: 'exercises', label: t.chartExercises },
              { dataKey: 'sets', label: t.chartSets },
            ]}
            skipAnimation
            xAxis={[{ dataKey: 'label', scaleType: 'band' }]}
          />
        ) : (
          <EmptyChartState message={t.noChartData} />
        )}
      </ChartCard>
    </Stack>
  );
}

function GoalComplianceHeatmap({
  points,
  translations,
}: {
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

  return (
    <Stack spacing={2}>
      <Stack direction='row' flexWrap='wrap' gap={2}>
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
                  minWidth: 148,
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
                  sx={{ minWidth: 56, whiteSpace: 'nowrap' }}
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
                    minWidth: 148,
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
                        aria-label={`${row.label}, ${point.label}: ${statusLabel}`}
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
      sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 6 }}
    >
      <Stack spacing={2}>
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
