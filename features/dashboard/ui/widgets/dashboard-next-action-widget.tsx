import Link from 'next/link';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
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
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
        minWidth: 0,
      }}
    >
      <Stack spacing={2}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <FlagRoundedIcon color='primary' fontSize='small' />
          <Typography component='h2' variant='h6'>
            {translations.nextActionTitle}
          </Typography>
        </Stack>

        <Stack spacing={0.75}>
          <Typography variant='subtitle1'>{content.title}</Typography>
          <Typography color='text.secondary'>{content.description}</Typography>
        </Stack>

        <Link href={action.href}>
          <Button endIcon={<ArrowForwardRoundedIcon />} variant='contained'>
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
