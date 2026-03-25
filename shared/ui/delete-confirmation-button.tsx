'use client';

import { useState } from 'react';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useFormStatus } from 'react-dom';

interface DeleteConfirmationButtonProps {
  action: (formData: FormData) => void | Promise<void>;
  ariaLabel?: string;
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  hiddenFields: Record<string, string>;
  title: string;
  tooltipLabel: string;
}

export function DeleteConfirmationButton({
  action,
  ariaLabel,
  cancelLabel,
  confirmLabel,
  description,
  hiddenFields,
  title,
  tooltipLabel,
}: DeleteConfirmationButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={tooltipLabel}>
        <IconButton
          aria-label={ariaLabel ?? tooltipLabel}
          color='error'
          onClick={() => setOpen(true)}
          size='small'
        >
          <DeleteOutlineRoundedIcon fontSize='small' />
        </IconButton>
      </Tooltip>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography color='text.secondary'>{description}</Typography>
        </DialogContent>
        <Box action={action} component='form'>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            {Object.entries(hiddenFields).map(([name, value]) => (
              <input key={name} name={name} type='hidden' value={value} />
            ))}
            <Button onClick={() => setOpen(false)} variant='text'>
              {cancelLabel}
            </Button>
            <DeleteSubmitButton label={confirmLabel} />
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

function DeleteSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button color='error' disabled={pending} type='submit' variant='contained'>
      {label}
    </Button>
  );
}
