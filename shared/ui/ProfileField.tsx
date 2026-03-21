import { Stack, Typography } from '@mui/material';

interface ProfileFieldProps {
  label: string;
  value?: string;
}

/**
 * Reusable read-only field for profile-style data presentation.
 * @param props - Component props for the presentation field.
 * @param props.label - Label describing the value.
 * @param props.value - Optional field value to display.
 * @returns A React element rendering a labeled read-only field.
 * @remarks Missing values are rendered as a simple dash placeholder.
 */
export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <Stack
      spacing={0.5}
      sx={{
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 4,
      }}
    >
      <Typography color='text.secondary' variant='body2'>
        {label}
      </Typography>
      <Typography variant='subtitle1'>{value || '-'}</Typography>
    </Stack>
  );
}
