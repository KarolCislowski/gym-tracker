import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { SettingsPage } from '@/features/settings/ui/settings-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface SettingsRoutePageProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function SettingsRoutePage({
  searchParams,
}: SettingsRoutePageProps) {
  const session = await auth();

  if (!session?.user?.id || !session.user.tenantDbName || !session.user.email) {
    redirect('/login');
  }

  const params = searchParams ? await searchParams : undefined;
  const userSnapshot = await getAuthenticatedUserSnapshot(
    session.user.tenantDbName,
    session.user.id,
  );
  const translations = getTranslations(userSnapshot.settings?.language);

  return (
    <SettingsPage
      email={session.user.email}
      error={params?.error}
      status={params?.status}
      translations={translations}
      userSnapshot={userSnapshot}
    />
  );
}
