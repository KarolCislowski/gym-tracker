'use client';

import { useEffect, useRef, useState } from 'react';

import type { MarkElementProps } from '@mui/x-charts/LineChart';
import { MarkElement } from '@mui/x-charts/LineChart';
import { BarChart, LineChart } from '@mui/x-charts';
import {
  Box,
  Button,
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

import type { DashboardAnalytics } from '../../application/dashboard-analytics';
import {
  resolveAnalyticsStateMessage,
  resolveBodyMetricsState,
  resolveWellbeingState,
  resolveWorkoutVolumeState,
} from '../../application/dashboard-analytics-state';
import { DashboardAnalyticsCard } from './dashboard-analytics-card';

interface DashboardAnalyticsExpandedChartsProps {
  analytics: DashboardAnalytics;
  isMobile: boolean;
  translations: TranslationDictionary;
  unitSystem: UnitSystem;
}

interface AnalyticsTableColumn {
  field: string;
  headerName: string;
  minWidth?: number;
}

const BODY_METRICS_CHART_GAP_PX = 16;
const BODY_METRICS_SAFETY_BUFFER_PX = 20;
const MOBILE_WELLBEING_DAYS = 7;
const MOBILE_BODY_METRICS_DAYS = 7;
const MOBILE_WORKOUT_VOLUME_WEEKS = 6;
const MOBILE_WORKOUT_VOLUME_SERIES = 3;
const WELLBEING_MIN_CHART_WIDTH_PX = 520;
const BODY_METRICS_MIN_CHART_WIDTH_PX = 420;
const WORKOUT_VOLUME_MIN_CHART_WIDTH_PX = 520;

export function DashboardAnalyticsExpandedCharts({
  analytics,
  isMobile,
  translations,
  unitSystem,
}: DashboardAnalyticsExpandedChartsProps) {
  const theme = useTheme();
  const t = translations.dashboard;
  const dailyT = translations.dailyReports;
  const wellbeingDataset = isMobile
    ? analytics.wellbeing.slice(-MOBILE_WELLBEING_DAYS)
    : analytics.wellbeing;
  const wellbeingState = resolveWellbeingState(wellbeingDataset);
  const bodyMetricsSource = isMobile
    ? analytics.bodyMetrics.slice(-MOBILE_BODY_METRICS_DAYS)
    : analytics.bodyMetrics;
  const bodyMetricsState = resolveBodyMetricsState(bodyMetricsSource);
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
  const workoutVolumeState = resolveWorkoutVolumeState(
    workoutVolumeDataset,
    workoutVolumeChartMuscleGroups,
  );

  return (
    <>
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
          wellbeingState === 'ready' ? (
            isMobile ? (
              <Stack spacing={2}>
                <LineChart
                  dataset={wellbeingDataset}
                  grid={{ horizontal: true }}
                  height={Math.max(180, Math.floor((chartHeight - 16) / 2))}
                  series={mobilePrimaryWellbeingSeries}
                  skipAnimation
                  slots={{ mark: OffsetWellbeingMark }}
                  xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
                  yAxis={[{ min: 0, max: 5 }]}
                />
                <LineChart
                  dataset={wellbeingDataset}
                  grid={{ horizontal: true }}
                  height={Math.max(180, Math.floor((chartHeight - 16) / 2))}
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
                grid={{ horizontal: true }}
                height={chartHeight}
                series={wellbeingSeries}
                skipAnimation
                slots={{ mark: OffsetWellbeingMark }}
                xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
                yAxis={[{ min: 0, max: 5 }]}
              />
            )
          ) : (
            <EmptyChartState message={resolveAnalyticsStateMessage(wellbeingState, t)} />
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
          bodyMetricsState === 'ready' ? (
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
                series={[
                  {
                    dataKey: 'restingHeartRate',
                    label: dailyT.restingHeartRateLabel,
                  },
                ]}
                skipAnimation
                xAxis={[{ dataKey: 'label', scaleType: 'point' }]}
              />
            </Stack>
          ) : (
            <EmptyChartState message={resolveAnalyticsStateMessage(bodyMetricsState, t)} />
          )
        }
      </MeasuredChartCard>

      <MeasuredChartCard
        chartViewLabel={t.chartViewLabel}
        minChartHeight={isMobile ? 232 : 280}
        minChartWidth={WORKOUT_VOLUME_MIN_CHART_WIDTH_PX}
        renderTable={() => (
          <Stack spacing={1.5}>
            {analytics.workoutVolumeMuscleGroups.length >
            defaultWorkoutVolumeMuscleGroups.length ? (
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
              rows={buildWorkoutVolumeRows(
                workoutVolumeDataset,
                workoutVolumeMuscleGroups,
              )}
              title={t.workoutVolumeChart}
            />
          </Stack>
        )}
        tableViewLabel={t.tableViewLabel}
        title={t.workoutVolumeChart}
      >
        {(chartHeight) =>
          workoutVolumeState === 'ready' ? (
            <BarChart
              dataset={workoutVolumeDataset}
              height={chartHeight}
              series={workoutVolumeChartMuscleGroups.map((muscleGroup) => ({
                dataKey: muscleGroup,
                label: analytics.workoutVolumeMuscleGroupLabels[muscleGroup],
              }))}
              skipAnimation
              sx={{
                '& .MuiChartsSurface-root': {
                  backgroundColor: 'transparent',
                },
              }}
              xAxis={[{ dataKey: 'label', scaleType: 'band' }]}
            />
          ) : (
            <EmptyChartState message={resolveAnalyticsStateMessage(workoutVolumeState, t)} />
          )
        }
      </MeasuredChartCard>
    </>
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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const chartFrameRef = useRef<HTMLDivElement | null>(null);
  const [chartHeight, setChartHeight] = useState(minChartHeight);
  const [contentWidth, setContentWidth] = useState(0);
  const [preferredView, setPreferredView] = useState<'chart' | 'table'>('chart');
  const shouldForceTable =
    Boolean(renderTable) && contentWidth > 0 && contentWidth < minChartWidth;
  const activeView = shouldForceTable ? 'table' : preferredView;
  const renderKey = `${title}-${activeView}-${shouldForceTable ? 'forced' : 'free'}`;

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
  }, [activeView, minChartHeight]);

  return (
    <DashboardAnalyticsCard>
      <Stack ref={contentRef} spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <Stack
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='space-between'
          spacing={1}
        >
          <Typography
            color='text.secondary'
            sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
            variant='overline'
          >
            {title}
          </Typography>
          {renderTable && !shouldForceTable ? (
            <Stack direction='row' spacing={1}>
              <Button
                onClick={() => setPreferredView('chart')}
                size='small'
                sx={{ borderRadius: 999, px: 1.6 }}
                variant={activeView === 'chart' ? 'contained' : 'outlined'}
              >
                {chartViewLabel}
              </Button>
              <Button
                onClick={() => setPreferredView('table')}
                size='small'
                sx={{ borderRadius: 999, px: 1.6 }}
                variant={activeView === 'table' ? 'contained' : 'outlined'}
              >
                {tableViewLabel}
              </Button>
            </Stack>
          ) : null}
        </Stack>
        {activeView === 'table' && renderTable ? (
          <Box key={renderKey}>
            {renderTable()}
          </Box>
        ) : (
          <Box
            key={renderKey}
            ref={chartFrameRef}
            sx={{
              position: 'relative',
              flex: 1,
              minHeight: minChartHeight,
              overflow: 'visible',
              borderRadius: 4,
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
    </DashboardAnalyticsCard>
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
): AnalyticsTableColumn[] {
  return [
    { field: 'label', headerName: dashboardT.periodLabel, minWidth: 96 },
    { field: 'mood', headerName: dailyT.columnMood, minWidth: 88 },
    { field: 'energy', headerName: dailyT.columnEnergy, minWidth: 88 },
    { field: 'stress', headerName: dailyT.columnStress, minWidth: 88 },
    { field: 'recovery', headerName: dailyT.columnRecovery, minWidth: 96 },
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
): AnalyticsTableColumn[] {
  return [
    { field: 'label', headerName: dashboardT.periodLabel, minWidth: 96 },
    { field: 'bodyWeightKg', headerName: bodyWeightLabel, minWidth: 120 },
    {
      field: 'restingHeartRate',
      headerName: dailyT.restingHeartRateLabel,
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
): AnalyticsTableColumn[] {
  return [
    { field: 'label', headerName: dashboardT.periodLabel, minWidth: 110 },
    ...muscleGroups.map<AnalyticsTableColumn>((muscleGroup) => ({
      field: muscleGroup,
      headerName: labels[muscleGroup],
      minWidth: 116,
    })),
  ];
}

function buildWorkoutVolumeRows(
  dataset: DashboardAnalytics['workoutVolume'],
  muscleGroups: string[],
): Array<Record<string, number | string>> {
  return dataset.map((point) => {
    const row: Record<string, number | string> = {
      label: point.label,
    };

    muscleGroups.forEach((muscleGroup) => {
      row[muscleGroup] =
        typeof point[muscleGroup] === 'number' ? point[muscleGroup] : 0;
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
  columns: AnalyticsTableColumn[];
  emptyMessage: string;
  rows: Array<Record<string, number | string | null>>;
  title: string;
}) {
  return (
    <TableContainer
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: 0,
        width: '100%',
        bgcolor: 'rgba(255,255,255,0.04)',
      }}
    >
      {rows.length ? (
        <Table aria-label={title} size='small'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    backgroundColor: 'action.hover',
                    minWidth: column.minWidth,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={String(row.id ?? `${title}-${index}`)}>
                {columns.map((column, columnIndex) => {
                  const value = row[column.field];

                  return (
                    <TableCell
                      component={columnIndex === 0 ? 'th' : 'td'}
                      key={column.field}
                      scope={columnIndex === 0 ? 'row' : undefined}
                      sx={{
                        minWidth: column.minWidth,
                        verticalAlign: 'middle',
                      }}
                    >
                      {value == null || value === '' ? '—' : String(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Stack
          alignItems='center'
          justifyContent='center'
          sx={{ minHeight: 160, px: 3 }}
        >
          <Typography color='text.secondary'>{emptyMessage}</Typography>
        </Stack>
      )}
    </TableContainer>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 2.5,
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'rgba(255,255,255,0.04)',
      }}
    >
      <Typography color='text.secondary' variant='body2'>
        {message}
      </Typography>
    </Box>
  );
}
