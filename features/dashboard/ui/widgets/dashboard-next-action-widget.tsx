'use client';

import Link from 'next/link';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import { alpha } from '@mui/material/styles';
import { Button, Paper, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { DashboardNextAction } from '../../application/dashboard-next-action';

interface DashboardNextActionWidgetProps {
  action: DashboardNextAction;
  translations: TranslationDictionary['dashboard'];
}

/**
 * Focus card that points the user to the single most useful next step on the dashboard.
 * @param props - Component props for the next-action widget.
 * @param props.action - The prioritized next action resolved from current user state.
 * @param props.translations - Localized dashboard copy.
 * @returns A React element rendering the next recommended step.
 */
export function DashboardNextActionWidget({
  action,
  translations,
}: DashboardNextActionWidgetProps) {
  const content = getNextActionContent(action.kind, translations);

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        display: 'flex',
        p: 3,
        border: 1,
        borderColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.08)
            : alpha(theme.palette.common.black, 0.08),
        borderRadius: 8,
        minWidth: 0,
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.3)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`
            : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.16)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.04)}`
            : `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.7)}`,
      })}
    >
      <Stack spacing={2.5} sx={{ width: '100%' }}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <FlagRoundedIcon color='primary' fontSize='small' />
          <Typography component='h2' variant='h6'>
            {translations.nextActionTitle}
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Typography sx={{ maxWidth: 28 + 'ch' }} variant='h5'>
            {content.title}
          </Typography>
          <Typography color='text.secondary'>{content.description}</Typography>
        </Stack>

        <Link href={action.href}>
          <Button
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              px: 2,
              py: 1.1,
              borderRadius: 999,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
            variant='contained'
          >
            {content.cta}
          </Button>
        </Link>

      </Stack>
    </Paper>
  );
}

function getNextActionContent(
  kind: DashboardNextAction['kind'],
  t: TranslationDictionary['dashboard'],
) {
  switch (kind) {
    case 'complete_profile':
      return {
        title: t.nextActionProfileTitle,
        description: t.nextActionProfileDescription,
        cta: t.nextActionProfileCta,
      };
    case 'set_goals':
      return {
        title: t.nextActionGoalsTitle,
        description: t.nextActionGoalsDescription,
        cta: t.nextActionGoalsCta,
      };
    case 'first_daily_report':
      return {
        title: t.nextActionFirstDailyReportTitle,
        description: t.nextActionFirstDailyReportDescription,
        cta: t.nextActionFirstDailyReportCta,
      };
    case 'first_workout':
      return {
        title: t.nextActionFirstWorkoutTitle,
        description: t.nextActionFirstWorkoutDescription,
        cta: t.nextActionFirstWorkoutCta,
      };
    case 'today_daily_report':
      return {
        title: t.nextActionTodayDailyReportTitle,
        description: t.nextActionTodayDailyReportDescription,
        cta: t.nextActionTodayDailyReportCta,
      };
    case 'this_week_workout':
      return {
        title: t.nextActionThisWeekWorkoutTitle,
        description: t.nextActionThisWeekWorkoutDescription,
        cta: t.nextActionThisWeekWorkoutCta,
      };
    case 'review_progress':
      return {
        title: t.nextActionReviewProgressTitle,
        description: t.nextActionReviewProgressDescription,
        cta: t.nextActionReviewProgressCta,
      };
  }
}
