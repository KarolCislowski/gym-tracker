import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Supplement } from '../domain/supplement.types';
import { formatSupplementToken } from '../application/supplement-atlas-grid';

interface SupplementDetailsPageProps {
  supplement: Supplement;
  translations: TranslationDictionary;
}

/**
 * Server-rendered details page for a single atlas supplement with variant comparison.
 * @param props - Component props for the supplement details page.
 * @param props.supplement - The atlas supplement to present.
 * @param props.translations - The translation dictionary for the active language.
 * @returns A React element rendering supplement overview, notes, and variant comparison.
 */
export function SupplementDetailsPage({
  supplement,
  translations,
}: SupplementDetailsPageProps) {
  const t = translations.supplements;
  const defaultVariant = supplement.variants.find((variant) => variant.isDefault);

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Button
          href='/supplements'
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ alignSelf: 'flex-start' }}
          variant='text'
        >
          {t.backToAtlas}
        </Button>
        <Typography component='h1' variant='h3'>
          {supplement.name}
        </Typography>
        <Typography color='text.secondary'>
          {supplement.description ?? t.emptyValue}
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant='h5'>{t.sectionOverview}</Typography>
          <Stack
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            <DefinitionItem label={t.categoryLabel} value={formatSupplementToken(supplement.category)} />
            <DefinitionItem label={t.evidenceLabel} value={formatSupplementToken(supplement.evidenceLevel)} />
            <DefinitionItem label={t.variantCountLabel} value={String(supplement.variants.length)} />
            <DefinitionItem
              label={t.defaultVariantLabel}
              value={defaultVariant?.name ?? t.emptyValue}
            />
          </Stack>
          {!!supplement.goals?.length && (
            <ChipGroup
              label={t.goalsLabel}
              values={supplement.goals.map(formatSupplementToken)}
            />
          )}
          {!!supplement.tags?.length && (
            <ChipGroup
              label={t.tagsLabel}
              values={supplement.tags.map(formatSupplementToken)}
            />
          )}
        </Stack>
      </Paper>

      {!!supplement.benefits?.length && (
        <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 4 }}>
          <Stack spacing={1.5}>
            <Typography variant='h5'>{t.benefitsLabel}</Typography>
            {supplement.benefits.map((value) => (
              <Typography key={value}>{value}</Typography>
            ))}
          </Stack>
        </Paper>
      )}

      {!!supplement.cautions?.length && (
        <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 4 }}>
          <Stack spacing={1.5}>
            <Typography variant='h5'>{t.cautionsLabel}</Typography>
            {supplement.cautions.map((value) => (
              <Typography key={value}>{value}</Typography>
            ))}
          </Stack>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 4 }}>
        <Stack spacing={1.5}>
          <Typography variant='h5'>{t.sectionVariants}</Typography>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>{t.columnVariantName}</TableCell>
                  <TableCell>{t.columnForm}</TableCell>
                  <TableCell>{t.columnCompoundType}</TableCell>
                  <TableCell>{t.columnTypicalDose}</TableCell>
                  <TableCell>{t.columnTiming}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supplement.variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell>{variant.name}</TableCell>
                    <TableCell>{formatSupplementToken(variant.form)}</TableCell>
                    <TableCell>{formatSupplementToken(variant.compoundType)}</TableCell>
                    <TableCell>{variant.typicalDose}</TableCell>
                    <TableCell>
                      {variant.timing.map(formatSupplementToken).join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </Stack>
  );
}

function DefinitionItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack component='dl' spacing={0.25} sx={{ m: 0 }}>
      <Typography component='dt' color='text.secondary' variant='body2'>
        {label}
      </Typography>
      <Typography component='dd' sx={{ m: 0 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function ChipGroup({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <Stack spacing={1}>
      <Typography color='text.secondary' variant='body2'>
        {label}
      </Typography>
      <Stack direction='row' flexWrap='wrap' spacing={1} useFlexGap>
        {values.map((value) => (
          <Chip key={value} label={value} size='small' />
        ))}
      </Stack>
    </Stack>
  );
}
