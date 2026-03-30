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

/**
 * Client-side toggle wrapper that reveals supplement-stack editing only on demand.
 * @param props - Component props for the supplement-stack editor.
 * @param props.initialStack - Existing stack used to prefill the edit form.
 * @param props.initiallyOpen - Whether the editor should start expanded after a failed submit.
 * @param props.supplements - Atlas entries available for stack composition.
 * @param props.translations - Full translation dictionary for localized labels.
 * @returns A React element rendering the supplement-stack edit controls.
 */
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
          onCancel={() => setIsOpen(false)}
          stackId={initialStack.id}
          submitLabel={t.updateStackLabel}
          supplements={supplements}
          translations={translations}
        />
      </Collapse>
    </Stack>
  );
}
