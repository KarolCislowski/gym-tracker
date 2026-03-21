'use client';

import { useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Alert,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { ProfileEditForm } from './profile-edit-form';
import { ProfileView } from './profile-view';

interface ProfilePageProps {
  error?: string;
  status?: string;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

function resolveProfileFeedback(
  t: TranslationDictionary['profile'],
  error?: string,
  status?: string,
): { severity: 'success' | 'error'; message: string } | null {
  if (status === 'updated') {
    return { severity: 'success', message: t.updated };
  }

  if (error) {
    return { severity: 'error', message: t.errorGeneric };
  }

  return null;
}

/**
 * Profile page with view and edit modes for tenant profile data.
 * @param props - Component props for the profile page.
 * @param props.error - Optional error code returned by profile actions.
 * @param props.status - Optional success status returned by profile actions.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current profile and settings snapshot.
 * @returns A React element rendering the profile page in either view or edit mode.
 * @remarks The component defaults to edit mode after an error and view mode otherwise.
 */
export function ProfilePage({
  error,
  status,
  translations,
  userSnapshot,
}: ProfilePageProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(error ? 'edit' : 'view');
  const t = translations.profile;
  const profile = userSnapshot?.profile;
  const feedback = resolveProfileFeedback(t, error, status);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent='space-between'
        spacing={2}
      >
        <Stack spacing={1}>
          <Typography variant='h3'>{t.title}</Typography>
          <Typography color='text.secondary'>{t.description}</Typography>
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

      {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

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
          <Stack spacing={0.5}>
            <Typography variant='h6'>{t.personalInfoTitle}</Typography>
            <Typography color='text.secondary'>
              {t.personalInfoDescription}
            </Typography>
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
    </Stack>
  );
}
