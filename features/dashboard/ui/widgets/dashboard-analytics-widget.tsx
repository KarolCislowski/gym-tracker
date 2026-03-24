'use client';

import { useEffect, useRef, useState } from 'react';

import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import type { MarkElementProps } from '@mui/x-charts/LineChart';
import { MarkElement } from '@mui/x-charts/LineChart';
import { BarChart, LineChart } from '@mui/x-charts';
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
const MOBILE_GOAL_COMPLIANCE_DAYS = 7;
const MOBILE_WELLBEING_DAYS = 7;
const MOBILE_BODY_METRICS_DAYS = 7;
const MOBILE_WORKOUT_VOLUME_WEEKS = 6;
const MOBILE_WORKOUT_VOLUME_SERIES = 3;
const WELLBEING_MIN_CHART_WIDTH_PX = 520;
const BODY_METRICS_MIN_CHART_WIDTH_PX = 420;
const WORKOUT_VOLUME_MIN_CHART_WIDTH_PX = 520;

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const t = translations.dashboard;
  const habitsT = translations.healthyHabits;
  const dailyT = translations.dailyReports;
  const goalCompliancePoints = isMobile
    ? analytics.goalCompliance.slice(-MOBILE_GOAL_COMPLIANCE_DAYS)
    : analytics.goalCompliance;
  const wellbeingDataset = isMobile
    ? analytics.wellbeing.slice(-MOBILE_WELLBEING_DAYS)
    : analytics.wellbeing;
  const bodyMetricsSource = isMobile
    ? analytics.bodyMetrics.slice(-MOBILE_BODY_METRICS_DAYS)
    : analytics.bodyMetrics;
  const bodyMetricsDataset = bodyMetricsSource.map((point) => ({
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
  const mobilePrimaryWellbeingSeries = wellbeingSeries.slice(0, 2);
  const mobileSecondaryWellbeingSeries = wellbeingSeries.slice(2);
  const workoutVolumeDataset = isMobile
    ? analytics.workoutVolume.slice(-MOBILE_WORKOUT_VOLUME_WEEKS)
    : analytics.workoutVolume;
  const defaultWorkoutVolumeMuscleGroups = isMobile
    ? analytics.workoutVolumeMuscleGroups.slice(0, MOBILE_WORKOUT_VOLUME_SERIES)
    : analytics.workoutVolumeMuscleGroups.slice(0, 6);
  const [showAllWorkoutVolumeGroups, setShowAllWorkoutVolumeGroups] = useState(false);
  const workoutVolumeChartMuscleGroups = defaultWorkoutVolumeMuscleGroups;
  const workoutVolumeMuscleGroups = showAllWorkoutVolumeGroups
    ? analytics.workoutVolumeMuscleGroups
    : defaultWorkoutVolumeMuscleGroups;

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
        {goalCompliancePoints.length ? (
          <GoalComplianceHeatmap
            compact={isMobile}
            points={goalCompliancePoints}
            translations={translations}
          />
        ) : (
          <EmptyChartState message={t.noChartData} />
        )}
      </ChartCard>

      <MeasuredChartCard
        chartViewLabel={t.chartViewLabel}
        minChartHeight={isMobile ? 400 : 280}
        minChartWidth={WELLBEING_MIN_CHART_WIDTH_PX}
        renderTable={() => (
          <AnalyticsDataGrid
            columns={buildWellbeingColumns(dailyT, t)}
            emptyMessage={t.noChartData}
            rows={buildWellbeingRows(wellbeingDataset)}
            title={t.wellbeingChart}
          />
        )}
        tableViewLabel={t.tableViewLabel}
        title={t.wellbeingChart}
      >
        {(chartHeight) =>
          wellbeingDataset.length ? (
            isMobile ? (
              <Stack spacing={2}>
                <LineChart
                  dataset={wellbeingDataset}
                  height={Math.max(180, Math.floor((chartHeight - 16) / 2))}
                  grid={{ horizontal: true }}
                  series={mobilePrimaryWellbeingSeries}
                  skipAnimation
                  slots={{ mark: OffsetWellbeingMark }}
                  xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
                  yAxis={[{ min: 0, max: 5 }]}
                />
                <LineChart
                  dataset={wellbeingDataset}
                  height={Math.max(180, Math.floor((chartHeight - 16) / 2))}
                  grid={{ horizontal: true }}
                  series={mobileSecondaryWellbeingSeries}
                  skipAnimation
                  slots={{ mark: OffsetWellbeingMark }}
                  xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
                  yAxis={[{ min: 0, max: 5 }]}
                />
              </Stack>
            ) : (
              <LineChart
                dataset={wellbeingDataset}
                height={chartHeight}
                grid={{ horizontal: true }}
                series={wellbeingSeries}
                skipAnimation
                slots={{ mark: OffsetWellbeingMark }}
                xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
                yAxis={[{ min: 0, max: 5 }]}
              />
            )
          ) : (
            <EmptyChartState message={t.noChartData} />
          )
        }
      </MeasuredChartCard>

      <MeasuredChartCard
        chartViewLabel={t.chartViewLabel}
        minChartHeight={isMobile ? 400 : 456}
        minChartWidth={BODY_METRICS_MIN_CHART_WIDTH_PX}
        renderTable={() => (
          <AnalyticsDataGrid
            columns={buildBodyMetricsColumns(dailyT, t, bodyWeightLabel)}
            emptyMessage={t.noChartData}
            rows={buildBodyMetricsRows(bodyMetricsDataset)}
            title={t.bodyMetricsChart}
          />
        )}
        tableViewLabel={t.tableViewLabel}
        title={t.bodyMetricsChart}
      >
        {(chartHeight) =>
          bodyMetricsSource.some(
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

      <MeasuredChartCard
        chartViewLabel={t.chartViewLabel}
        minChartHeight={isMobile ? 232 : 280}
        minChartWidth={WORKOUT_VOLUME_MIN_CHART_WIDTH_PX}
        renderTable={() => (
          <Stack spacing={1.5}>
            {analytics.workoutVolumeMuscleGroups.length > defaultWorkoutVolumeMuscleGroups.length ? (
              <Button
                onClick={() => setShowAllWorkoutVolumeGroups((current) => !current)}
                size='small'
                sx={{ alignSelf: 'flex-start' }}
                variant='outlined'
              >
                {showAllWorkoutVolumeGroups ? t.showLessLabel : t.showAllLabel}
              </Button>
            ) : null}
            <AnalyticsDataGrid
              columns={buildWorkoutVolumeColumns(
                workoutVolumeMuscleGroups,
                analytics.workoutVolumeMuscleGroupLabels,
                t,
              )}
              emptyMessage={t.noChartData}
              rows={buildWorkoutVolumeRows(workoutVolumeDataset, workoutVolumeMuscleGroups)}
              title={t.workoutVolumeChart}
            />
          </Stack>
        )}
        tableViewLabel={t.tableViewLabel}
        title={t.workoutVolumeChart}
      >
        {(chartHeight) =>
          workoutVolumeDataset.length &&
          workoutVolumeChartMuscleGroups.length ? (
            <BarChart
              dataset={workoutVolumeDataset}
              height={chartHeight}
              series={workoutVolumeChartMuscleGroups.map((muscleGroup) => ({
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
  chartViewLabel,
  children,
  minChartHeight,
  minChartWidth = 0,
  renderTable,
  tableViewLabel,
  title,
}: {
  chartViewLabel: string;
  children: (chartHeight: number) => React.ReactNode;
  minChartHeight: number;
  minChartWidth?: number;
  renderTable?: () => React.ReactNode;
  tableViewLabel: string;
  title: string;
}) {
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const chartFrameRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(minChartHeight);
  const [contentWidth, setContentWidth] = useState(0);
  const [preferredView, setPreferredView] = useState<'chart' | 'table'>('chart');
  const shouldForceTable = Boolean(renderTable) && contentWidth > 0 && contentWidth < minChartWidth;
  const activeView = shouldForceTable ? 'table' : preferredView;

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return undefined;
    }

    const updateWidth = () => {
      const nextWidth = Math.floor(contentElement.getBoundingClientRect().width);

      setContentWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth,
      );
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(contentElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeView !== 'chart') {
      return undefined;
    }

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

    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(frameElement);

    return () => {
      observer.disconnect();
    };
  }, [activeView, minChartHeight, theme]);

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
        minWidth: 0,
      }}
    >
      <Stack ref={contentRef} spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Stack
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='space-between'
          spacing={1}
        >
          <Typography component='h2' variant='h6'>
            {title}
          </Typography>
          {renderTable && !shouldForceTable ? (
            <Stack direction='row' spacing={1}>
              <Button
                onClick={() => setPreferredView('chart')}
                size='small'
                variant={activeView === 'chart' ? 'contained' : 'outlined'}
              >
                {chartViewLabel}
              </Button>
              <Button
                onClick={() => setPreferredView('table')}
                size='small'
                variant={activeView === 'table' ? 'contained' : 'outlined'}
              >
                {tableViewLabel}
              </Button>
            </Stack>
          ) : null}
        </Stack>
        {activeView === 'table' && renderTable ? (
          renderTable()
        ) : (
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
        )}
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

function buildWellbeingColumns(
  dailyT: TranslationDictionary['dailyReports'],
  dashboardT: TranslationDictionary['dashboard'],
): GridColDef[] {
  return [
    { field: 'label', headerName: dashboardT.periodLabel, flex: 1, minWidth: 96 },
    { field: 'mood', headerName: dailyT.columnMood, flex: 1, minWidth: 88 },
    { field: 'energy', headerName: dailyT.columnEnergy, flex: 1, minWidth: 88 },
    { field: 'stress', headerName: dailyT.columnStress, flex: 1, minWidth: 88 },
    { field: 'recovery', headerName: dailyT.columnRecovery, flex: 1, minWidth: 96 },
  ];
}

function buildWellbeingRows(
  dataset: DashboardAnalytics['wellbeing'],
): Array<Record<string, number | string | null>> {
  return dataset.map((point, index) => ({
    id: `${point.label}-${index}`,
    ...point,
  }));
}

function buildBodyMetricsColumns(
  dailyT: TranslationDictionary['dailyReports'],
  dashboardT: TranslationDictionary['dashboard'],
  bodyWeightLabel: string,
): GridColDef[] {
  return [
    { field: 'label', headerName: dashboardT.periodLabel, flex: 1, minWidth: 96 },
    { field: 'bodyWeightKg', headerName: bodyWeightLabel, flex: 1, minWidth: 120 },
    {
      field: 'restingHeartRate',
      headerName: dailyT.restingHeartRateLabel,
      flex: 1,
      minWidth: 136,
    },
  ];
}

function buildBodyMetricsRows(
  dataset: DashboardAnalytics['bodyMetrics'],
): Array<Record<string, number | string>> {
  return dataset.map((point, index) => ({
    id: `${point.label}-${index}`,
    label: point.label,
    bodyWeightKg: point.bodyWeightKg ?? '—',
    restingHeartRate:
      point.restingHeartRate == null ? '—' : `${point.restingHeartRate} bpm`,
  }));
}

function buildWorkoutVolumeColumns(
  muscleGroups: string[],
  labels: Record<string, string>,
  dashboardT: TranslationDictionary['dashboard'],
): GridColDef[] {
  return [
    { field: 'label', headerName: dashboardT.periodLabel, flex: 1, minWidth: 110 },
    ...muscleGroups.map<GridColDef>((muscleGroup) => ({
      field: muscleGroup,
      headerName: labels[muscleGroup],
      flex: 1,
      minWidth: 116,
    })),
  ];
}

function buildWorkoutVolumeRows(
  dataset: DashboardAnalytics['workoutVolume'],
  muscleGroups: string[],
): Array<Record<string, number | string>> {
  return dataset.map((point, index) => {
    const row: Record<string, number | string> = {
      id: `${point.label}-${index}`,
      label: point.label,
    };

    muscleGroups.forEach((muscleGroup) => {
      row[muscleGroup] = typeof point[muscleGroup] === 'number' ? point[muscleGroup] : 0;
    });

    return row;
  });
}

function AnalyticsDataGrid({
  columns,
  emptyMessage,
  rows,
  title,
}: {
  columns: GridColDef[];
  emptyMessage: string;
  rows: Array<Record<string, number | string | null>>;
  title: string;
}) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: 0,
        width: '100%',
      }}
    >
      <DataGrid
        aria-label={title}
        autoHeight
        columns={columns}
        disableColumnMenu
        disableRowSelectionOnClick
        disableVirtualization
        hideFooter
        rows={rows}
        sx={{
          border: 0,
          minWidth: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'background.default',
          },
          '& .MuiDataGrid-cell': {
            alignItems: 'center',
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <Stack
              alignItems='center'
              justifyContent='center'
              sx={{ minHeight: 160, px: 3 }}
            >
              <Typography color='text.secondary'>{emptyMessage}</Typography>
            </Stack>
          ),
        }}
      />
    </Box>
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
