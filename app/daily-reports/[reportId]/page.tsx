import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { getDailyReportDetails } from '@/features/daily-reports/application/daily-report.service';
import { DailyReportDetailsPage } from '@/features/daily-reports/ui/daily-report-details-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface DailyReportDetailsRoutePageProps {
  params: Promise<{
    reportId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function DailyReportDetailsRoutePage({
  params,
  searchParams,
}: DailyReportDetailsRoutePageProps) {
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
  const report = await getDailyReportDetails(
    session.user.tenantDbName,
    session.user.id,
    routeParams.reportId,
  );

  return (
    <DailyReportDetailsPage
      error={query?.error}
      report={report}
      status={query?.status}
      translations={translations}
      userSnapshot={userSnapshot}
    />
  );
}
