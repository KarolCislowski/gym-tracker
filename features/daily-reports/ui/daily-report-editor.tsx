'use client';

import { useId, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { DailyReportDetails } from '../domain/daily-report.types';
import { updateDailyReportAction } from '../infrastructure/daily-report.actions';
import { DailyReportForm } from './daily-report-form';

interface DailyReportEditorProps {
  initialReport: DailyReportDetails;
  initiallyOpen?: boolean;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Client-side toggle wrapper for editing an existing daily report.
 * @param props - Component props for the daily report editor.
 * @param props.initialReport - Existing report details used to seed the edit form.
 * @param props.initiallyOpen - Whether the edit form should start expanded.
 * @param props.translations - Translation dictionary for localized labels.
 * @param props.userSnapshot - Authenticated user snapshot used for privacy-aware field visibility.
 * @returns A React element rendering the edit toggle and collapsible form.
 */
export function DailyReportEditor({
  initialReport,
  initiallyOpen = false,
  translations,
  userSnapshot,
}: DailyReportEditorProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const t = translations.dailyReports;
  const buttonId = useId();
  const panelId = useId();

  return (
    <Stack spacing={2}>
      <Button
        aria-controls={panelId}
        aria-expanded={isOpen}
        id={buttonId}
        onClick={() => setIsOpen((current) => !current)}
        size='large'
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <EditRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeEditLabel : t.openEditLabel}
      </Button>

      <Collapse
        aria-labelledby={buttonId}
        id={panelId}
        in={isOpen}
        role='region'
        timeout='auto'
        unmountOnExit
      >
        <DailyReportForm
          formAction={updateDailyReportAction}
          initialReport={initialReport}
          onCancel={() => setIsOpen(false)}
          reportId={initialReport.id}
          submitLabel={t.updateReport}
          translations={translations}
          userSnapshot={userSnapshot}
        />
      </Collapse>
    </Stack>
  );
}
