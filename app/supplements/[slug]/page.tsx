import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { getSupplementAtlasDetails } from '@/features/supplements/application/supplement-atlas.service';
import { SupplementDetailsPage } from '@/features/supplements/ui/supplement-details-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface SupplementDetailsRoutePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Renders the authenticated supplement-details route.
 * @param props - Route params containing the supplement slug to resolve.
 * @returns The supplement details page for the requested atlas entry.
 * @remarks Missing supplements resolve to Next.js `notFound()` after tenant-specific translations are prepared.
 */
export default async function SupplementDetailsRoutePage({
  params,
}: SupplementDetailsRoutePageProps) {
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
  const supplement = await getSupplementAtlasDetails(routeParams.slug);

  if (!supplement) {
    notFound();
  }

  return <SupplementDetailsPage supplement={supplement} translations={translations} />;
}
