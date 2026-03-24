import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listSupplementAtlas } from '@/features/supplements/application/supplement-atlas.service';
import {
  listSupplementIntakeReports,
  listSupplementStacks,
} from '@/features/supplementation/application/supplementation.service';
import { SupplementationPage } from '@/features/supplementation/ui/supplementation-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface SupplementationRoutePageProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

/**
 * Renders the authenticated supplementation workspace route.
 * @param props - Optional route search params used for post-submit feedback.
 * @returns The supplement-stack and intake-report page for the active user session.
 */
export default async function SupplementationRoutePage({
  searchParams,
}: SupplementationRoutePageProps) {
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
  const [supplements, stacks, reports] = await Promise.all([
    listSupplementAtlas(),
    listSupplementStacks(session.user.tenantDbName, session.user.id),
    listSupplementIntakeReports(session.user.tenantDbName, session.user.id),
  ]);

  return (
    <SupplementationPage
      error={params?.error}
      reports={reports}
      stacks={stacks}
      status={params?.status}
      supplements={supplements}
      translations={translations}
    />
  );
}
