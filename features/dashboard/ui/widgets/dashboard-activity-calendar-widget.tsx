'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import type { SupportedLanguage, TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import type { DailyReportSummary } from '@/features/daily-reports/domain/daily-report.types';
import type { WorkoutSessionSummary } from '@/features/workouts/domain/workout.types';

import {
  buildDashboardActivityCalendarMonth,
  resolveDashboardActivityCalendarSelection,
} from '../../application/dashboard-activity-calendar';
import { DashboardWidgetShell } from '../layout/dashboard-widget-shell';

interface DashboardActivityCalendarWidgetProps {
  dailyReports: DailyReportSummary[];
  language: SupportedLanguage;
  translations: TranslationDictionary['dashboard'];
  workoutSessions: WorkoutSessionSummary[];
}

const weekdayLabelsByLanguage: Record<SupportedLanguage, string[]> = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  pl: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'],
  sv: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'],
};

const localeByLanguage: Record<SupportedLanguage, string> = {
  en: 'en-US',
  pl: 'pl-PL',
  sv: 'sv-SE',
};

/**
 * Interactive month calendar widget that lets users inspect which reports were logged on a given day.
 * @param props - Component props for the dashboard activity calendar widget.
 * @param props.dailyReports - Daily report summaries available on the dashboard.
 * @param props.language - Active UI language used for date formatting and weekday labels.
 * @param props.translations - Localized dashboard copy.
 * @param props.workoutSessions - Workout session summaries available on the dashboard.
 * @returns A React element rendering an inspectable activity calendar widget.
 */
export function DashboardActivityCalendarWidget({
  dailyReports,
  language,
  translations,
  workoutSessions,
}: DashboardActivityCalendarWidgetProps) {
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const month = useMemo(
    () =>
      buildDashboardActivityCalendarMonth({
        dailyReports,
        referenceDate,
        workoutSessions,
      }),
    [dailyReports, referenceDate, workoutSessions],
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    resolveDashboardActivityCalendarSelection(month),
  );
  const selectedDay =
    month.days.find((day) => day.dateKey === selectedDateKey) ?? month.days[0];
  const locale = localeByLanguage[language];
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${month.monthStartKey}T00:00:00.000Z`));
  const selectedDateLabel = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${selectedDay.dateKey}T00:00:00.000Z`));
  const hasEntriesInMonth = month.days.some(
    (day) =>
      day.isCurrentMonth &&
      (day.dailyReportId != null || day.workoutReports.length > 0),
  );

  useEffect(() => {
    setSelectedDateKey(resolveDashboardActivityCalendarSelection(month));
  }, [month]);

  return (
    <DashboardWidgetShell density='feature' height='tall'>
      <Stack spacing={2.5}>
        <Stack spacing={0.75}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <CalendarMonthRoundedIcon color='primary' fontSize='small' />
            <Typography component='h2' variant='h6'>
              {translations.activityCalendarTitle}
            </Typography>
          </Stack>
          <Typography color='text.secondary' variant='body2'>
            {translations.activityCalendarDescription}
          </Typography>
        </Stack>

        <Stack
          alignItems='center'
          direction='row'
          justifyContent='space-between'
          spacing={1}
        >
          <IconButton
            aria-label={translations.activityCalendarPreviousMonth}
            onClick={() => {
              setReferenceDate((current) =>
                new Date(
                  Date.UTC(
                    current.getUTCFullYear(),
                    current.getUTCMonth() - 1,
                    1,
                  ),
                ),
              );
            }}
            size='small'
          >
            <ChevronLeftRoundedIcon fontSize='small' />
          </IconButton>
          <Typography sx={{ textTransform: 'capitalize' }} variant='subtitle1'>
            {monthLabel}
          </Typography>
          <IconButton
            aria-label={translations.activityCalendarNextMonth}
            onClick={() => {
              setReferenceDate((current) =>
                new Date(
                  Date.UTC(
                    current.getUTCFullYear(),
                    current.getUTCMonth() + 1,
                    1,
                  ),
                ),
              );
            }}
            size='small'
          >
            <ChevronRightRoundedIcon fontSize='small' />
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          }}
        >
          {weekdayLabelsByLanguage[language].map((label) => (
            <Typography
              color='text.secondary'
              key={label}
              sx={{ textAlign: 'center' }}
              variant='caption'
            >
              {label}
            </Typography>
          ))}
          {month.days.map((day) => {
            const hasEntries = day.dailyReportId != null || day.workoutReports.length > 0;
            const isSelected = selectedDay.dateKey === day.dateKey;

            return (
              <Button
                color='inherit'
                key={day.dateKey}
                onClick={() => setSelectedDateKey(day.dateKey)}
                sx={(theme) => ({
                  minWidth: 0,
                  minHeight: 56,
                  px: 0.75,
                  py: 1,
                  borderRadius: 3,
                  border: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  borderColor: isSelected
                    ? theme.palette.primary.main
                    : day.isCurrentMonth
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.text.primary, 0.08),
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.1)
                    : hasEntries
                      ? alpha(theme.palette.primary.main, 0.04)
                      : 'transparent',
                  color: day.isCurrentMonth
                    ? theme.palette.text.primary
                    : theme.palette.text.disabled,
                })}
                variant='text'
              >
                <Typography variant='body2'>{day.dayOfMonth}</Typography>
                <Stack direction='row' spacing={0.5}>
                  <Box
                    sx={(theme) => ({
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor:
                        day.dailyReportId != null
                          ? theme.palette.success.main
                          : alpha(theme.palette.text.primary, 0.12),
                    })}
                  />
                  <Box
                    sx={(theme) => ({
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor:
                        day.workoutReports.length > 0
                          ? theme.palette.warning.main
                          : alpha(theme.palette.text.primary, 0.12),
                    })}
                  />
                </Stack>
              </Button>
            );
          })}
        </Box>

        <Stack
          spacing={1.5}
          sx={{
            p: 2,
            borderRadius: 4,
            border: 1,
            borderColor: 'divider',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <Typography variant='subtitle2'>{selectedDateLabel}</Typography>

          {!hasEntriesInMonth ? (
            <Typography color='text.secondary' variant='body2'>
              {translations.activityCalendarNoEntries}
            </Typography>
          ) : selectedDay.dailyReportId == null &&
            selectedDay.workoutReports.length === 0 ? (
            <Typography color='text.secondary' variant='body2'>
              {translations.activityCalendarEmptyDay}
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {selectedDay.dailyReportId ? (
                <Stack spacing={0.75}>
                  <Typography color='text.secondary' variant='caption'>
                    {translations.activityCalendarDailyReportLabel}
                  </Typography>
                  <Link href={`/daily-reports/${selectedDay.dailyReportId}`}>
                    <Button
                      size='small'
                      startIcon={<TodayRoundedIcon fontSize='small' />}
                      sx={{ alignSelf: 'flex-start' }}
                      variant='outlined'
                    >
                      {translations.activityCalendarOpenDailyReport}
                    </Button>
                  </Link>
                </Stack>
              ) : null}

              {selectedDay.workoutReports.length > 0 ? (
                <Stack spacing={0.75}>
                  <Typography color='text.secondary' variant='caption'>
                    {translations.activityCalendarWorkoutReportsLabel}
                  </Typography>
                  {selectedDay.workoutReports.map((workout) => (
                    <Link href={`/workouts/${workout.id}`} key={workout.id}>
                      <Button
                        size='small'
                        startIcon={<FitnessCenterRoundedIcon fontSize='small' />}
                        sx={{ justifyContent: 'flex-start' }}
                        variant='outlined'
                      >
                        {translations.activityCalendarOpenWorkout}: {workout.workoutName}
                      </Button>
                    </Link>
                  ))}
                </Stack>
              ) : null}
            </Stack>
          )}
        </Stack>
      </Stack>
    </DashboardWidgetShell>
  );
}
