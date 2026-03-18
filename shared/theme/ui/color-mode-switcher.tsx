'use client';

import { useTransition } from 'react';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import {
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import { setGuestColorModePreference } from '../infrastructure/theme.actions';
import type { AppColorMode } from '../domain/theme.types';

interface ColorModeSwitcherProps {
  mode: AppColorMode;
}

export function ColorModeSwitcher({ mode }: ColorModeSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextMode: AppColorMode) => {
    startTransition(async () => {
      await setGuestColorModePreference(nextMode);
      router.refresh();
    });
  };

  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <Typography variant='body2' color='text.secondary'>
        Theme
      </Typography>
      <Tooltip title='Light mode'>
        <span>
          <IconButton
            aria-label='Enable light mode'
            color={mode === 'light' ? 'primary' : 'default'}
            disabled={isPending}
            onClick={() => handleChange('light')}
            size='small'
          >
            <LightModeRoundedIcon fontSize='small' />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title='Dark mode'>
        <span>
          <IconButton
            aria-label='Enable dark mode'
            color={mode === 'dark' ? 'primary' : 'default'}
            disabled={isPending}
            onClick={() => handleChange('dark')}
            size='small'
          >
            <DarkModeRoundedIcon fontSize='small' />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
