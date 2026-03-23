'use client';

import { useEffect, useRef, useState } from 'react';

import type { MarkElementProps } from '@mui/x-charts/LineChart';
import { MarkElement } from '@mui/x-charts/LineChart';
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
import { alpha, useTheme } from '@mui/material/styles';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import {
  convertBodyMassFromMetric,
  convertMassFromMetric,
} from '@/shared/units/application/unit-conversion';
import type { UnitSystem } from '@/shared/units/domain/unit-system.types';

import type {
  DashboardAnalytics,
  GoalComplianceChartPoint,
} from '../../application/dashboard-analytics';

interface DashboardAnalyticsWidgetProps {
  analytics: DashboardAnalytics;
  translations: TranslationDictionary;
  unitSystem: UnitSystem;
}

const BODY_METRICS_CHART_GAP_PX = 16;
const BODY_METRICS_SAFETY_BUFFER_PX = 20;

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
  const t = translations.dashboard;
  const habitsT = translations.healthyHabits;
  const dailyT = translations.dailyReports;
  const bodyMetricsDataset = analytics.bodyMetrics.map((point) => ({
    ...point,
    bodyWeightKg:
      point.bodyWeightKg == null
        ? null
        : convertBodyWeightForChart(point.bodyWeightKg, unitSystem).value,
  }));
  const bodyWeightUnit = resolveBodyWeightChartUnit(unitSystem);
  const bodyWeightLabel = buildChartUnitLabel(
    dailyT.bodyWeightLabel,
    bodyWeightUnit,
  );
  const wellbeingSeries = [
    {
      id: 'mood',
      dataKey: 'mood',
      label: dailyT.columnMood,
      showMark: true,
      shape: 'circle' as const,
      color: alpha(theme.palette.primary.main, 0.6),
      colorGetter: () => theme.palette.primary.main,
    },
    {
      id: 'energy',
      dataKey: 'energy',
      label: dailyT.columnEnergy,
      showMark: true,
      shape: 'diamond' as const,
      color: alpha(theme.palette.success.main, 0.6),
      colorGetter: () => theme.palette.success.main,
    },
    {
      id: 'stress',
      dataKey: 'stress',
      label: dailyT.columnStress,
      showMark: true,
      shape: 'square' as const,
      color: alpha(theme.palette.error.main, 0.6),
      colorGetter: () => theme.palette.error.main,
    },
    {
      id: 'recovery',
      dataKey: 'recovery',
      label: dailyT.columnRecovery,
      showMark: true,
      shape: 'triangle' as const,
      color: alpha(theme.palette.secondary.main, 0.6),
      colorGetter: () => theme.palette.secondary.main,
    },
  ];

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

      <MeasuredChartCard minChartHeight={280} title={t.wellbeingChart}>
        {(chartHeight) =>
          analytics.wellbeing.length ? (
            <LineChart
              dataset={analytics.wellbeing}
              height={chartHeight}
              grid={{ horizontal: true }}
              series={wellbeingSeries}
              skipAnimation
              slots={{ mark: OffsetWellbeingMark }}
              xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
              yAxis={[{ min: 0, max: 5 }]}
            />
          ) : (
            <EmptyChartState message={t.noChartData} />
          )
        }
      </MeasuredChartCard>

      <MeasuredChartCard minChartHeight={456} title={t.bodyMetricsChart}>
        {(chartHeight) =>
          analytics.bodyMetrics.some(
            (point) =>
              point.bodyWeightKg != null || point.restingHeartRate != null,
          ) ? (
            <Stack spacing={2}>
              <LineChart
                dataset={bodyMetricsDataset}
                height={resolveBodyMetricsChartHeight(chartHeight)}
                series={[{ dataKey: 'bodyWeightKg', label: bodyWeightLabel }]}
                skipAnimation
                xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
              />
              <LineChart
                dataset={bodyMetricsDataset}
                height={resolveBodyMetricsChartHeight(chartHeight)}
                series={[{ dataKey: 'restingHeartRate', label: dailyT.restingHeartRateLabel }]}
                skipAnimation
                xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
              />
            </Stack>
          ) : (
            <EmptyChartState message={t.noChartData} />
          )
        }
      </MeasuredChartCard>

      <MeasuredChartCard minChartHeight={280} title={t.workoutVolumeChart}>
        {(chartHeight) =>
          analytics.workoutVolume.length &&
          analytics.workoutVolumeMuscleGroups.length ? (
            <BarChart
              dataset={analytics.workoutVolume}
              height={chartHeight}
              series={analytics.workoutVolumeMuscleGroups.map((muscleGroup) => ({
                dataKey: muscleGroup,
                label: analytics.workoutVolumeMuscleGroupLabels[muscleGroup],
              }))}
              skipAnimation
              xAxis={[{ dataKey: 'label', scaleType: 'band' }]}
            />
          ) : (
            <EmptyChartState message={t.noChartData} />
          )
        }
      </MeasuredChartCard>
    </Stack>
  );
}

function buildChartUnitLabel(label: string, unit: string): string {
  const baseLabel = label.replace(/\s*\(.+\)\s*$/, '');

  return `${baseLabel} (${unit})`;
}

function resolveBodyMetricsChartHeight(chartHeight: number): number {
  return Math.max(
    172,
    Math.floor(
      (chartHeight - BODY_METRICS_CHART_GAP_PX - BODY_METRICS_SAFETY_BUFFER_PX) / 2,
    ),
  );
}

function MeasuredChartCard({
  children,
  minChartHeight,
  title,
}: {
  children: (chartHeight: number) => React.ReactNode;
  minChartHeight: number;
  title: string;
}) {
  const theme = useTheme();
  const chartFrameRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(minChartHeight);

  useEffect(() => {
    const frameElement = chartFrameRef.current;

    if (!frameElement) {
      return undefined;
    }

    const updateHeight = () => {
      const nextHeight = Math.max(
        minChartHeight,
        Math.floor(frameElement.getBoundingClientRect().height),
      );

      setChartHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(frameElement);

    return () => {
      observer.disconnect();
    };
  }, [minChartHeight, theme]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
        height: '100%',
        display: 'flex',
      }}
    >
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Typography component='h2' variant='h6'>
          {title}
        </Typography>
        <Box
          ref={chartFrameRef}
          sx={{
            position: 'relative',
            flex: 1,
            minHeight: minChartHeight,
            overflow: 'visible',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              minHeight: minChartHeight,
            }}
          >
            {children(chartHeight)}
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

function convertBodyWeightForChart(
  kilograms: number,
  unitSystem: UnitSystem,
): { value: number } {
  if (unitSystem === 'imperial_uk') {
    const converted = convertBodyMassFromMetric(kilograms, unitSystem);

    if ('stones' in converted) {
      return {
        value: Number((converted.stones + converted.pounds / 14).toFixed(1)),
      };
    }
  }

  return { value: convertMassFromMetric(kilograms, unitSystem).value };
}

function resolveBodyWeightChartUnit(unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial_uk') {
    return 'st';
  }

  return unitSystem === 'metric' ? 'kg' : 'lb';
}

function OffsetWellbeingMark(props: MarkElementProps) {
  const offsetBySeries: Record<string, number> = {
    mood: -6,
    energy: -2,
    stress: 2,
    recovery: 6,
  };
  const seriesId = String(props.id);
  const xOffset = offsetBySeries[seriesId] ?? 0;
  const x = typeof props.x === 'number' ? props.x : Number(props.x ?? 0);

  return <MarkElement {...props} x={x + xOffset} />;
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
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
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
