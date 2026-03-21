'use client';

import { useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Button, Paper, Stack, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { ProfileEditForm } from './profile-edit-form';
import { ProfileView } from './profile-view';

interface ProfileDetailsSectionProps {
  initialMode?: 'view' | 'edit';
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Client-side wrapper that controls view and edit modes for the personal profile section.
 * @param props - Component props for the editable profile details section.
 * @param props.initialMode - The initial mode for the section.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current profile snapshot.
 * @returns A React element rendering the profile details section with local edit state.
 * @remarks Keeping the state here allows the page container to remain server-rendered.
 */
export function ProfileDetailsSection({
  initialMode = 'view',
  translations,
  userSnapshot,
}: ProfileDetailsSectionProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const t = translations.profile;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          justifyContent='space-between'
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant='h6'>{t.personalInfoTitle}</Typography>
            <Typography color='text.secondary'>
              {t.personalInfoDescription}
            </Typography>
          </Stack>
          {mode === 'view' ? (
            <Button
              onClick={() => setMode('edit')}
              startIcon={<EditRoundedIcon />}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
              variant='contained'
            >
              {t.editProfile}
            </Button>
          ) : (
            <Button
              onClick={() => setMode('view')}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
              variant='outlined'
            >
              {t.cancelEditing}
            </Button>
          )}
        </Stack>

        {mode === 'view' ? (
          <ProfileView
            translations={translations}
            userSnapshot={userSnapshot}
          />
        ) : (
          <ProfileEditForm
            translations={translations}
            userSnapshot={userSnapshot}
          />
        )}
      </Stack>
    </Paper>
  );
}
