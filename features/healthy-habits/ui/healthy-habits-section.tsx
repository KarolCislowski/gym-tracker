'use client';

import { useEffect, useRef, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Button, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { HealthyHabitsEditForm } from './healthy-habits-edit-form';
import { HealthyHabitsView } from './healthy-habits-view';

interface HealthyHabitsSectionProps {
  initialMode?: 'view' | 'edit';
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Client-side wrapper that controls view and edit modes for the healthy habits section.
 * @param props - Component props for the editable healthy habits section.
 * @param props.initialMode - The initial mode for the section.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current snapshot.
 * @returns A React element rendering the healthy habits section with local edit state.
 */
export function HealthyHabitsSection({
  initialMode = 'view',
  translations,
  userSnapshot,
}: HealthyHabitsSectionProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const t = translations.healthyHabits;

  useEffect(() => {
    if (mode !== 'edit') {
      return;
    }

    const firstField = sectionRef.current?.querySelector<HTMLElement>(
      'form input:not([disabled]), form textarea:not([disabled]), form [role="combobox"]',
    );

    firstField?.focus();
  }, [mode]);

  return (
    <Paper
      elevation={0}
      ref={sectionRef}
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
            <Typography component='h2' variant='h6'>
              {t.title}
            </Typography>
            <Typography color='text.secondary'>{t.description}</Typography>
          </Stack>
          {mode === 'view' ? (
            <Tooltip title={t.editGoals}>
              <IconButton
                aria-label={t.editGoals}
                onClick={() => setMode('edit')}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
              >
                <EditRoundedIcon />
              </IconButton>
            </Tooltip>
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
          <HealthyHabitsView
            translations={translations}
            userSnapshot={userSnapshot}
          />
        ) : (
          <HealthyHabitsEditForm
            translations={translations}
            userSnapshot={userSnapshot}
          />
        )}
      </Stack>
    </Paper>
  );
}
