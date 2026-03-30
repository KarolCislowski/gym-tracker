import { buildWorkoutDuplicateDraft } from '@/features/workouts/application/workout-duplicate';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listExerciseAtlas } from '@/features/exercises/application/exercise-atlas.service';
import {
  getWorkoutSessionDetails,
  listWorkoutSessions,
  listWorkoutTemplates,
} from '@/features/workouts/application/workout.service';
import { WorkoutReportsPage } from '@/features/workouts/ui/workout-reports-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface WorkoutReportsRoutePageProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
    duplicateReportId?: string;
  }>;
}

export default async function WorkoutReportsRoutePage({
  searchParams,
}: WorkoutReportsRoutePageProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const params = searchParams ? await searchParams : undefined;
  const userSnapshot = await getAuthenticatedUserSnapshot(
    session.user.tenantDbName,
    session.user.id,
  );
  const translations = getTranslations(userSnapshot.settings?.language);
  const exercises = await listExerciseAtlas();
  const [reports, templates, duplicateSourceReport] = await Promise.all([
    listWorkoutSessions(session.user.tenantDbName, session.user.id),
    listWorkoutTemplates(session.user.tenantDbName, session.user.id),
    params?.duplicateReportId
      ? getWorkoutSessionDetails(
          session.user.tenantDbName,
          session.user.id,
          params.duplicateReportId,
        )
      : Promise.resolve(null),
  ]);

  return (
    <WorkoutReportsPage
      error={params?.error}
      exercises={exercises}
      favoriteExerciseSlugs={userSnapshot.favoriteExerciseSlugs}
      initialDuplicateDraft={
        duplicateSourceReport ? buildWorkoutDuplicateDraft(duplicateSourceReport) : null
      }
      reports={reports}
      status={params?.status}
      templates={templates}
      translations={translations}
    />
  );
}
