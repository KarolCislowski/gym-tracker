import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { updateProfileAction } from '../infrastructure/profile.actions';

interface ProfileEditFormProps {
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
  translations,
  userSnapshot,
}: ProfileEditFormProps) {
  const t = translations.profile;
  const profile = userSnapshot?.profile;

  return (
    <Stack component='form' action={updateProfileAction} spacing={2}>
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
          defaultValue={profile?.age ?? ''}
          label={t.ageLabel}
          name='age'
          slotProps={{ htmlInput: { min: 0, max: 120 } }}
          type='number'
        />
        <TextField
          defaultValue={profile?.gender ?? ''}
          label={t.biologicalSexLabel}
          name='gender'
          select
          slotProps={{
            input: {
              endAdornment: (
                <Tooltip title={t.biologicalSexTooltip}>
                  <IconButton edge='end' size='small' tabIndex={-1}>
                    <HelpOutlineRoundedIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              ),
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

      <Button
        startIcon={<SaveRoundedIcon />}
        type='submit'
        variant='contained'
      >
        {t.saveChanges}
      </Button>
    </Stack>
  );
}
