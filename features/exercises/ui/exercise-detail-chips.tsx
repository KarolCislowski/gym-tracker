import { Chip, Stack, Typography } from '@mui/material';

interface ExerciseDetailChipsProps {
  label: string;
  values?: string[];
}

/**
 * Reusable labeled chip group for exercise details sections.
 * @param props - Component props for the labeled chip group.
 * @param props.label - Section label shown above the chip list.
 * @param props.values - Values rendered as outlined chips.
 * @returns A React element rendering the chip group or `null` when there are no values.
 */
export function ExerciseDetailChips({
  label,
  values,
}: ExerciseDetailChipsProps) {
  if (!values?.length) {
    return null;
  }

  return (
    <Stack spacing={0.75}>
      <Typography variant='subtitle2'>{label}</Typography>
      <Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
        {values.map((value) => (
          <Chip key={value} label={value} size='small' variant='outlined' />
        ))}
      </Stack>
    </Stack>
  );
}
