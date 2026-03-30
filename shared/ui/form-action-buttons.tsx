import type { ReactNode } from 'react';
import { Button, Stack } from '@mui/material';

interface FormActionButtonsProps {
  clearLabel: string;
  discardLabel?: string;
  onClear?: () => void;
  onDiscard?: () => void;
  submitColor?: 'primary' | 'error';
  submitDisabled?: boolean;
  submitFullWidth?: boolean;
  submitIcon?: ReactNode;
  submitLabel: string;
}

/**
 * Renders a consistent action row for form reset, discard, and submit actions.
 * @param props - Component props for the reusable form action row.
 * @returns A React element rendering secondary form actions next to submit.
 */
export function FormActionButtons({
  clearLabel,
  discardLabel,
  onClear,
  onDiscard,
  submitColor = 'primary',
  submitDisabled = false,
  submitFullWidth = false,
  submitIcon,
  submitLabel,
}: FormActionButtonsProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
      <Button
        onClick={onClear}
        type={onClear ? 'button' : 'reset'}
        variant='outlined'
      >
        {clearLabel}
      </Button>
      {discardLabel && onDiscard ? (
        <Button onClick={onDiscard} type='button' variant='text'>
          {discardLabel}
        </Button>
      ) : null}
      <Button
        color={submitColor}
        disabled={submitDisabled}
        fullWidth={submitFullWidth}
        startIcon={submitIcon}
        sx={{ ml: { sm: 'auto' } }}
        type='submit'
        variant='contained'
      >
        {submitLabel}
      </Button>
    </Stack>
  );
}
