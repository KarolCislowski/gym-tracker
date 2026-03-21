import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { ProfilePage } from '@/features/profile/ui/profile-page';
import { getTranslations } from '@/shared/i18n/application/i18n.service';

interface ProfileRoutePageProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function ProfileRoutePage({
  searchParams,
}: ProfileRoutePageProps) {
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

  return (
    <ProfilePage
      error={params?.error}
      status={params?.status}
      translations={translations}
      userSnapshot={userSnapshot}
    />
  );
}
