import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import {
  getSupplementIntakeReportDetails,
  listSupplementStacks,
} from '@/features/supplementation/application/supplementation.service';
import { SupplementIntakeDetailsPage } from '@/features/supplementation/ui/supplement-intake-details-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface SupplementIntakeDetailsRoutePageProps {
  params: Promise<{
    reportId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function SupplementIntakeDetailsRoutePage({
  params,
  searchParams,
}: SupplementIntakeDetailsRoutePageProps) {
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
  const [report, stacks] = await Promise.all([
    getSupplementIntakeReportDetails(
      session.user.tenantDbName,
      session.user.id,
      routeParams.reportId,
    ),
    listSupplementStacks(session.user.tenantDbName, session.user.id),
  ]);

  return (
    <SupplementIntakeDetailsPage
      error={query?.error}
      report={report}
      stacks={stacks}
      status={query?.status}
      translations={translations}
    />
  );
}
