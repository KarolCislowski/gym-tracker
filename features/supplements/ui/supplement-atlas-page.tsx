import { Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Supplement } from '../domain/supplement.types';
import { SupplementAtlasGrid } from './supplement-atlas-grid';

interface SupplementAtlasPageProps {
  supplements: Supplement[];
  translations: TranslationDictionary;
}

/**
 * Server-rendered page shell for the shared supplement atlas.
 * @param props - Component props for the supplement atlas page.
 * @param props.supplements - Supplements loaded from the shared Core atlas.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering the supplement atlas heading and data grid.
 */
export function SupplementAtlasPage({
  supplements,
  translations,
}: SupplementAtlasPageProps) {
  const t = translations.supplements;

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component='h1' variant='h3'>
          {t.title}
        </Typography>
        <Typography color='text.secondary'>{t.description}</Typography>
      </Stack>
      <SupplementAtlasGrid supplements={supplements} translations={t} />
    </Stack>
  );
}
