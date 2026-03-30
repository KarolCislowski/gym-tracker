'use client';

import { useState } from 'react';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { FormActionButtons } from '@/shared/ui/form-action-buttons';
import { useUnsavedChangesWarning } from '@/shared/ui/use-unsaved-changes-warning';
import { convertHeightFromMetric } from '@/shared/units/application/unit-conversion';

import { formatBirthDateForDateInput } from '../application/profile-view';
import { updateProfileAction } from '../infrastructure/profile.actions';
import { ProfileLocationField } from './profile-location-field';

interface ProfileEditFormProps {
  onCancel?: () => void;
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Editable profile form for tenant profile data.
 * @param props - Component props for the editable profile form.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current profile snapshot.
 * @returns A React element rendering the editable profile form.
 * @remarks The form posts to a server action and preserves optional profile values when left blank.
 */
export function ProfileEditForm({
  onCancel,
  translations,
  userSnapshot,
}: ProfileEditFormProps) {
  const t = translations.profile;
  const { formRef, markSubmitted } = useUnsavedChangesWarning({
    message: translations.common.unsavedChangesWarning,
  });
  const profile = userSnapshot?.profile;
  const unitSystem = userSnapshot?.settings?.unitSystem ?? 'metric';
  const biologicalSexHelpId = 'biological-sex-help';
  const heightValue =
    profile?.heightCm != null
      ? convertHeightFromMetric(profile.heightCm, unitSystem)
      : null;
  const [locationResetKey, setLocationResetKey] = useState(0);

  return (
    <Stack
      component='form'
      action={updateProfileAction}
      onSubmitCapture={markSubmitted}
      ref={formRef}
      spacing={2}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <TextField
          defaultValue={profile?.firstName ?? ''}
          label={t.firstNameLabel}
          name='firstName'
          required
        />
        <TextField
          defaultValue={profile?.lastName ?? ''}
          label={t.lastNameLabel}
          name='lastName'
          required
        />
        <TextField disabled label={t.emailLabel} value={profile?.email ?? ''} />
        <TextField
          defaultValue={formatBirthDateForDateInput(profile?.birthDate ?? null)}
          label={t.birthDateLabel}
          name='birthDate'
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { max: new Date().toISOString().slice(0, 10) },
          }}
          type='date'
        />
        <ProfileLocationField
          defaultLocation={profile?.location ?? null}
          resetKey={locationResetKey}
          translations={t}
        />
        <input type='hidden' name='unitSystem' value={unitSystem} />
        {unitSystem === 'metric' ? (
          <TextField
            defaultValue={
              heightValue?.system === 'metric' ? heightValue.value : ''
            }
            label={t.heightCentimetersLabel}
            name='heightCm'
            slotProps={{ htmlInput: { min: 30, max: 300, step: 0.1 } }}
            type='number'
          />
        ) : (
          <>
            <TextField
              defaultValue={
                heightValue && heightValue.system !== 'metric'
                  ? heightValue.feet
                  : ''
              }
              label={t.heightFeetLabel}
              name='heightFeet'
              slotProps={{ htmlInput: { min: 1, max: 9, step: 1 } }}
              type='number'
            />
            <TextField
              defaultValue={
                heightValue && heightValue.system !== 'metric'
                  ? heightValue.inches
                  : ''
              }
              label={t.heightInchesLabel}
              name='heightInches'
              slotProps={{ htmlInput: { min: 0, max: 11, step: 1 } }}
              type='number'
            />
          </>
        )}
        <TextField
          helperText={t.biologicalSexTooltip}
          defaultValue={profile?.gender ?? ''}
          label={t.biologicalSexLabel}
          name='gender'
          select
          slotProps={{
            formHelperText: {
              id: biologicalSexHelpId,
            },
            htmlInput: {
              'aria-describedby': biologicalSexHelpId,
            },
          }}
        >
          <MenuItem value=''>{t.emptyValue}</MenuItem>
          <MenuItem value='female'>{t.sexFemale}</MenuItem>
          <MenuItem value='male'>{t.sexMale}</MenuItem>
          <MenuItem value='other'>{t.sexOther}</MenuItem>
          <MenuItem value='prefer_not_to_say'>{t.sexPreferNotToSay}</MenuItem>
        </TextField>
        <TextField
          defaultValue={profile?.activityLevel ?? ''}
          label={t.activityLevelLabel}
          name='activityLevel'
          select
        >
          <MenuItem value=''>{t.emptyValue}</MenuItem>
          <MenuItem value='sedentary'>{t.activitySedentary}</MenuItem>
          <MenuItem value='lightly_active'>{t.activityLightlyActive}</MenuItem>
          <MenuItem value='moderately_active'>{t.activityModeratelyActive}</MenuItem>
          <MenuItem value='very_active'>{t.activityVeryActive}</MenuItem>
          <MenuItem value='extra_active'>{t.activityExtraActive}</MenuItem>
        </TextField>
      </Box>

      <FormActionButtons
        clearLabel={translations.common.clearForm}
        discardLabel={onCancel ? translations.common.discardForm : undefined}
        onClear={() => {
          formRef.current?.reset();
          setLocationResetKey((current) => current + 1);
        }}
        onDiscard={onCancel}
        submitIcon={<SaveRoundedIcon />}
        submitLabel={t.saveChanges}
      />
    </Stack>
  );
}
