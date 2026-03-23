import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listDailyReports } from '@/features/daily-reports/application/daily-report.service';
import { DailyReportsPage } from '@/features/daily-reports/ui/daily-reports-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface DailyReportsRoutePageProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function DailyReportsRoutePage({
  searchParams,
}: DailyReportsRoutePageProps) {
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
  const reports = await listDailyReports(
    session.user.tenantDbName,
    session.user.id,
  );

  return (
    <DailyReportsPage
      error={params?.error}
      reports={reports}
      status={params?.status}
      translations={translations}
      userSnapshot={userSnapshot}
    />
  );
}
