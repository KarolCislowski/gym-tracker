import { Box } from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import {
  getHealthyHabitsProteinLabel,
  getHealthyHabitsWaterLabel,
} from '@/features/healthy-habits/application/healthy-habits-view';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';
import { ProfileField } from '@/shared/ui/ProfileField';

interface HealthyHabitsViewProps {
  translations: TranslationDictionary;
  userSnapshot: AuthenticatedUserSnapshot | null;
}

/**
 * Read-only healthy habits goals view.
 * @param props - Component props for the healthy habits presentation mode.
 * @param props.translations - The translation dictionary for the active language.
 * @param props.userSnapshot - The authenticated user's current snapshot.
 * @returns A React element rendering healthy habits goals in presentation mode.
 */
export function HealthyHabitsView({
  translations,
  userSnapshot,
}: HealthyHabitsViewProps) {
  const t = translations.healthyHabits;
  const habits = userSnapshot?.healthyHabits;
  const unitSystem = userSnapshot?.settings?.unitSystem ?? 'metric';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      <ProfileField
        label={t.averageSleepHoursPerDayLabel}
        value={
          habits?.averageSleepHoursPerDay != null
            ? `${habits.averageSleepHoursPerDay} h`
            : undefined
        }
      />
      <ProfileField
        label={t.stepsPerDayLabel}
        value={habits?.stepsPerDay != null ? String(habits.stepsPerDay) : undefined}
      />
      <ProfileField
        label={t.waterPerDayLabel}
        value={getHealthyHabitsWaterLabel(
          t,
          habits?.waterLitersPerDay ?? null,
          unitSystem,
        )}
      />
      <ProfileField
        label={t.proteinPerDayLabel}
        value={getHealthyHabitsProteinLabel(
          t,
          habits?.proteinGramsPerDay ?? null,
          unitSystem,
        )}
      />
      <ProfileField
        label={t.strengthWorkoutsPerWeekLabel}
        value={
          habits?.strengthWorkoutsPerWeek != null
            ? String(habits.strengthWorkoutsPerWeek)
            : undefined
        }
      />
      <ProfileField
        label={t.cardioMinutesPerWeekLabel}
        value={
          habits?.cardioMinutesPerWeek != null
            ? String(habits.cardioMinutesPerWeek)
            : undefined
        }
      />
    </Box>
  );
}
