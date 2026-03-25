import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listSupplementAtlas } from '@/features/supplements/application/supplement-atlas.service';
import { getSupplementStackDetails } from '@/features/supplementation/application/supplementation.service';
import { SupplementStackDetailsPage } from '@/features/supplementation/ui/supplement-stack-details-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface SupplementStackDetailsRoutePageProps {
  params: Promise<{
    stackId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function SupplementStackDetailsRoutePage({
  params,
  searchParams,
}: SupplementStackDetailsRoutePageProps) {
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
  const [stack, supplements] = await Promise.all([
    getSupplementStackDetails(
      session.user.tenantDbName,
      session.user.id,
      routeParams.stackId,
    ),
    listSupplementAtlas(),
  ]);

  return (
    <SupplementStackDetailsPage
      error={query?.error}
      stack={stack}
      status={query?.status}
      supplements={supplements}
      translations={translations}
    />
  );
}
