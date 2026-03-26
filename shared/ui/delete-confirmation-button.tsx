'use client';

import { useId, useState } from 'react';
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

/**
 * Renders a reusable destructive-action icon button with a confirmation dialog.
 * @param props - Component props for the delete confirmation flow.
 * @param props.action - Server action executed after confirmation.
 * @param props.ariaLabel - Optional accessible label overriding the tooltip label.
 * @param props.cancelLabel - Label for dismissing the confirmation dialog.
 * @param props.confirmLabel - Label for the destructive submit action.
 * @param props.description - Explanatory text describing what will be deleted.
 * @param props.hiddenFields - Hidden form values required by the delete action.
 * @param props.title - Dialog title shown before confirmation.
 * @param props.tooltipLabel - Tooltip text shown on the trigger button.
 * @returns A React element rendering the trigger button and confirmation dialog.
 */
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
  const descriptionId = useId();

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

      <Dialog aria-describedby={descriptionId} onClose={() => setOpen(false)} open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography color='text.secondary' id={descriptionId}>
            {description}
          </Typography>
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
