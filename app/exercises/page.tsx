import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listExerciseAtlas } from '@/features/exercises/application/exercise-atlas.service';
import { ExerciseAtlasPage } from '@/features/exercises/ui/exercise-atlas-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

export default async function ExercisesRoutePage() {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const userSnapshot = await getAuthenticatedUserSnapshot(
    session.user.tenantDbName,
    session.user.id,
  );
  const translations = getTranslations(userSnapshot.settings?.language);
  const exercises = await listExerciseAtlas();

  return (
    <ExerciseAtlasPage
      exercises={exercises}
      favoriteExerciseSlugs={userSnapshot.favoriteExerciseSlugs}
      translations={translations}
    />
  );
}
