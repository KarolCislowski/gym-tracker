'use client';

import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { IconButton, Tooltip } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { replayOnboardingEventName } from './app-onboarding';

interface OnboardingReplayButtonProps {
  label: TranslationDictionary['dashboard']['replayOnboarding'];
}

export function OnboardingReplayButton({
  label,
}: OnboardingReplayButtonProps) {
  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={() => window.dispatchEvent(new Event(replayOnboardingEventName))}
        size='small'
      >
        <HelpOutlineRoundedIcon fontSize='small' />
      </IconButton>
    </Tooltip>
  );
}
