'use client';

import { useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { Button, Collapse, Stack } from '@mui/material';

import type { Supplement } from '@/features/supplements/domain/supplement.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { SupplementStackForm } from './supplement-stack-form';

interface SupplementStackComposerProps {
  initiallyOpen?: boolean;
  supplements: Supplement[];
  translations: TranslationDictionary;
}

/**
 * Client-side toggle wrapper that reveals the supplement-stack builder only on demand.
 * @param props - Component props for the supplement-stack composer.
 * @param props.initiallyOpen - Whether the form should start expanded.
 * @param props.supplements - Shared supplement atlas entries available to the stack builder.
 * @param props.translations - Translation dictionary for localized labels.
 * @returns A React element rendering the toggle button and collapsible stack form.
 */
export function SupplementStackComposer({
  initiallyOpen = false,
  supplements,
  translations,
}: SupplementStackComposerProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const t = translations.supplementation;

  return (
    <Stack spacing={2}>
      <Button
        onClick={() => setIsOpen((current) => !current)}
        size='large'
        startIcon={isOpen ? <ExpandLessRoundedIcon /> : <AddRoundedIcon />}
        type='button'
        variant={isOpen ? 'outlined' : 'contained'}
      >
        {isOpen ? t.closeStackComposerLabel : t.openStackComposerLabel}
      </Button>

      <Collapse in={isOpen} timeout='auto' unmountOnExit>
        <SupplementStackForm supplements={supplements} translations={translations} />
      </Collapse>
    </Stack>
  );
}
