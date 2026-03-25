import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listExerciseAtlas } from '@/features/exercises/application/exercise-atlas.service';
import { getWorkoutTemplateDetails } from '@/features/workouts/application/workout.service';
import { WorkoutTemplateDetailsPage } from '@/features/workouts/ui/workout-template-details-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface WorkoutTemplateDetailsRoutePageProps {
  params: Promise<{
    templateId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function WorkoutTemplateDetailsRoutePage({
  params,
  searchParams,
}: WorkoutTemplateDetailsRoutePageProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const routeParams = await params;
  const query = searchParams ? await searchParams : undefined;
  const userSnapshot = await getAuthenticatedUserSnapshot(
    session.user.tenantDbName,
    session.user.id,
  );
  const translations = getTranslations(userSnapshot.settings?.language);
  const [template, exercises] = await Promise.all([
    getWorkoutTemplateDetails(
      session.user.tenantDbName,
      session.user.id,
      routeParams.templateId,
    ),
    listExerciseAtlas(),
  ]);

  return (
    <WorkoutTemplateDetailsPage
      error={query?.error}
      exercises={exercises}
      status={query?.status}
      template={template}
      translations={translations}
    />
  );
}
