'use client';

import { useId, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type {
  SupplementIntakeReportSummary,
  SupplementStackSummary,
} from '../domain/supplementation.types';
import { updateSupplementIntakeReportAction } from '../infrastructure/supplementation.actions';
import { SupplementIntakeForm } from './supplement-intake-form';

interface SupplementIntakeEditorProps {
  initialReport: SupplementIntakeReportSummary;
  initiallyOpen?: boolean;
  stacks: SupplementStackSummary[];
  translations: TranslationDictionary;
}

export function SupplementIntakeEditor({
  initialReport,
  initiallyOpen = false,
  stacks,
  translations,
}: SupplementIntakeEditorProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const t = translations.supplementation;
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
        <SupplementIntakeForm
          formAction={updateSupplementIntakeReportAction}
          initialReport={initialReport}
          reportId={initialReport.id}
          stacks={stacks}
          submitLabel={t.updateReportLabel}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
