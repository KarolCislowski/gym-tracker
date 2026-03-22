import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { getExerciseAtlasDetails } from '@/features/exercises/application/exercise-atlas.service';
import { ExerciseDetailsPage } from '@/features/exercises/ui/exercise-details-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface ExerciseDetailsRoutePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ExerciseDetailsRoutePage({
  params,
}: ExerciseDetailsRoutePageProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const routeParams = await params;
  const userSnapshot = await getAuthenticatedUserSnapshot(
    session.user.tenantDbName,
    session.user.id,
  );
  const translations = getTranslations(userSnapshot.settings?.language);
  const exercise = await getExerciseAtlasDetails(routeParams.slug);

  if (!exercise) {
    notFound();
  }

  return (
    <ExerciseDetailsPage
      exercise={exercise}
      favoriteExerciseSlugs={userSnapshot.favoriteExerciseSlugs}
      translations={translations}
    />
  );
}
