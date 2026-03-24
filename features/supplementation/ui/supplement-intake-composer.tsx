'use client';

import { useId, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { SupplementStackSummary } from '../domain/supplementation.types';
import { SupplementIntakeForm } from './supplement-intake-form';

interface SupplementIntakeComposerProps {
  initiallyOpen?: boolean;
  stacks: SupplementStackSummary[];
  translations: TranslationDictionary;
}

/**
 * Client-side toggle wrapper that reveals the supplement-intake logger only on demand.
 * @param props - Component props for the supplement-intake composer.
 * @param props.initiallyOpen - Whether the form should start expanded.
 * @param props.stacks - User-owned supplement stacks available for quick logging.
 * @param props.translations - Translation dictionary for localized labels.
 * @returns A React element rendering the toggle button and collapsible intake form.
 */
export function SupplementIntakeComposer({
  initiallyOpen = false,
  stacks,
  translations,
}: SupplementIntakeComposerProps) {
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
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <AddRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeReportComposerLabel : t.openReportComposerLabel}
      </Button>

      <Collapse
        aria-labelledby={buttonId}
        id={panelId}
        in={isOpen}
        role='region'
        timeout='auto'
        unmountOnExit
      >
        <SupplementIntakeForm stacks={stacks} translations={translations} />
      </Collapse>
    </Stack>
  );
}
