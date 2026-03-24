import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { listSupplementAtlas } from '@/features/supplements/application/supplement-atlas.service';
import { SupplementAtlasPage } from '@/features/supplements/ui/supplement-atlas-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

/**
 * Renders the authenticated supplement-atlas route.
 * @returns The supplement atlas page for the active user session.
 * @remarks The route resolves user language from the tenant snapshot before loading shared Core atlas data.
 */
export default async function SupplementsRoutePage() {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName) {
    redirect('/login');
  }

  const userSnapshot = await getAuthenticatedUserSnapshot(
    session.user.tenantDbName,
    session.user.id,
  );
  const translations = getTranslations(userSnapshot.settings?.language);
  const supplements = await listSupplementAtlas();

  return <SupplementAtlasPage supplements={supplements} translations={translations} />;
}
