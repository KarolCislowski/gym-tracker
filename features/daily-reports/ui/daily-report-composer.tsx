'use client';

import { useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { DailyReportForm } from './daily-report-form';

interface DailyReportComposerProps {
  initiallyOpen?: boolean;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Client-side toggle wrapper that reveals the daily report form only after user intent.
 * @param props - Component props for the daily report composer.
 * @param props.initiallyOpen - Whether the form should start expanded.
 * @param props.translations - Translation dictionary for localized labels.
 * @param props.userSnapshot - Current authenticated user snapshot used by the form.
 * @returns A React element rendering the toggle button and collapsible daily report form.
 */
export function DailyReportComposer({
  initiallyOpen = false,
  translations,
  userSnapshot,
}: DailyReportComposerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const t = translations.dailyReports;

  return (
    <Stack spacing={2}>
      <Button
        onClick={() => setIsOpen((current) => !current)}
        size='large'
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <AddRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeComposerLabel : t.openComposerLabel}
      </Button>

      <Collapse in={isOpen} timeout='auto' unmountOnExit>
        <DailyReportForm translations={translations} userSnapshot={userSnapshot} />
      </Collapse>
    </Stack>
  );
}
