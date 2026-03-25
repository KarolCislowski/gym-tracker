'use client';

import { useId, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { Supplement } from '@/features/supplements/domain/supplement.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { SupplementStackSummary } from '../domain/supplementation.types';
import { updateSupplementStackAction } from '../infrastructure/supplementation.actions';
import { SupplementStackForm } from './supplement-stack-form';

interface SupplementStackEditorProps {
  initialStack: SupplementStackSummary;
  initiallyOpen?: boolean;
  supplements: Supplement[];
  translations: TranslationDictionary;
}

export function SupplementStackEditor({
  initialStack,
  initiallyOpen = false,
  supplements,
  translations,
}: SupplementStackEditorProps) {
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
        {isOpen ? t.closeStackEditLabel : t.openStackEditLabel}
      </Button>

      <Collapse
        aria-labelledby={buttonId}
        id={panelId}
        in={isOpen}
        role='region'
        timeout='auto'
        unmountOnExit
      >
        <SupplementStackForm
          formAction={updateSupplementStackAction}
          initialStack={initialStack}
          stackId={initialStack.id}
          submitLabel={t.updateStackLabel}
          supplements={supplements}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
