import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listExerciseAtlas } from '@/features/exercises/application/exercise-atlas.service';
import {
  getWorkoutSessionDetails,
  listWorkoutTemplates,
} from '@/features/workouts/application/workout.service';
import { WorkoutReportDetailsPage } from '@/features/workouts/ui/workout-report-details-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface WorkoutReportDetailsRoutePageProps {
  params: Promise<{
    reportId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function WorkoutReportDetailsRoutePage({
  params,
  searchParams,
}: WorkoutReportDetailsRoutePageProps) {
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
  const exercises = await listExerciseAtlas();
  const [report, templates] = await Promise.all([
    getWorkoutSessionDetails(
      session.user.tenantDbName,
      session.user.id,
      routeParams.reportId,
    ),
    listWorkoutTemplates(session.user.tenantDbName, session.user.id),
  ]);

  return (
    <WorkoutReportDetailsPage
      error={query?.error}
      exercises={exercises}
      favoriteExerciseSlugs={userSnapshot.favoriteExerciseSlugs}
      report={report}
      status={query?.status}
      templates={templates}
      translations={translations}
    />
  );
}
