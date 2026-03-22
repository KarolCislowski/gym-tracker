import { Box, Stack, Typography } from '@mui/material';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import type { Exercise } from '../domain/exercise.types';
import { formatAtlasToken } from '../application/exercise-atlas-grid';

interface ExerciseMuscleEngagementSectionProps {
  muscles: Exercise['muscles'];
  translations: TranslationDictionary['exercises'];
}

/**
 * Renders a grouped, accessible summary of muscle activation for an exercise.
 * @param props - Component props for the muscle engagement section.
 * @param props.muscles - Exercise muscle activations grouped by role.
 * @param props.translations - Localized labels for the section.
 * @returns A React element with grouped muscle activation rows.
 */
export function ExerciseMuscleEngagementSection({
  muscles,
  translations,
}: ExerciseMuscleEngagementSectionProps) {
  const primaryMuscles = getMusclesByRole('primary');
  const secondaryMuscles = getMusclesByRole('secondary');
  const stabilizerMuscles = getMusclesByRole('stabilizer');

  return (
    <Box component='section' aria-labelledby='exercise-muscle-engagement'>
      <Stack spacing={2}>
        <Typography id='exercise-muscle-engagement' variant='subtitle1'>
          {translations.sectionMuscleEngagement}
        </Typography>
        <Typography color='text.secondary' variant='body2'>
          {translations.muscleEngagementDisclaimer}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          <MuscleRoleColumn
            label={translations.primaryMusclesLabel}
            muscles={primaryMuscles}
            activationLevelLabel={translations.activationLevelLabel}
          />
          <MuscleRoleColumn
            label={translations.secondaryMusclesLabel}
            muscles={secondaryMuscles}
            activationLevelLabel={translations.activationLevelLabel}
          />
          <MuscleRoleColumn
            label={translations.stabilizerMusclesLabel}
            muscles={stabilizerMuscles}
            activationLevelLabel={translations.activationLevelLabel}
          />
        </Box>
      </Stack>
    </Box>
  );

  function getMusclesByRole(role: Exercise['muscles'][number]['role']) {
    return muscles
      .filter((muscle) => muscle.role === role)
      .sort((left, right) => right.activationLevel - left.activationLevel)
      .map((muscle) => ({
        label: formatAtlasToken(muscle.muscleGroupId),
        percentage: Math.round(muscle.activationLevel * 100),
      }));
  }
}

interface MuscleRoleColumnProps {
  label: string;
  muscles: Array<{ label: string; percentage: number }>;
  activationLevelLabel: string;
}

function MuscleRoleColumn({
  label,
  muscles,
  activationLevelLabel,
}: MuscleRoleColumnProps) {
  if (!muscles.length) {
    return null;
  }

  return (
    <Stack spacing={1.25} component='section' aria-label={label}>
      <Typography variant='subtitle2'>{label}</Typography>
      <Stack component='ul' spacing={1.25} sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {muscles.map((muscle) => (
          <Box key={`${label}-${muscle.label}`} component='li'>
            <Stack spacing={0.5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 2,
                }}
              >
                <Typography variant='body2'>{muscle.label}</Typography>
                <Typography color='text.secondary' variant='body2'>
                  {muscle.percentage}%
                </Typography>
              </Box>
              <Box
                aria-hidden='true'
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: 'action.hover',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${muscle.percentage}%`,
                    height: '100%',
                    borderRadius: 999,
                    bgcolor: 'primary.main',
                  }}
                />
              </Box>
              <Typography sx={srOnlyStyles}>{`${activationLevelLabel}: ${muscle.percentage}%`}</Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

const srOnlyStyles = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
} as const;
