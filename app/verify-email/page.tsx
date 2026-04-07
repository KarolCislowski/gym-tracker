import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { auth } from '@/auth';
import { VerifyEmailForm } from '@/features/auth/ui/verify-email/verify-email-form';
import { AuthPageShell } from '@/features/auth/ui/shared/auth-page-shell';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import {
  COLOR_MODE_COOKIE_NAME,
  resolveAppColorMode,
} from '@/shared/theme/application/theme-mode';

interface VerifyEmailPageProps {
  searchParams?: Promise<{
    lang?: string;
    token?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const session = await auth();
  const cookieStore = await cookies();
  const params = searchParams ? await searchParams : undefined;
  const activeLanguage = resolveLanguage(params?.lang);
  const activeColorMode = resolveAppColorMode(
    cookieStore.get(COLOR_MODE_COOKIE_NAME)?.value,
  );
  const t = getTranslations(activeLanguage);
  const rawToken = String(params?.token ?? '');

  if (session?.user) {
    redirect('/');
  }

  return (
    <AuthPageShell
      activeColorMode={activeColorMode}
      activeLanguage={activeLanguage}
      pathname='/verify-email'
      query={{
        lang: activeLanguage,
        token: rawToken,
      }}
      subtitle={t.auth.verifyEmailDescription}
      title={t.auth.verifyEmailTitle}
      translations={t}
      width='min(100%, 520px)'>
      <VerifyEmailForm
        activeLanguage={activeLanguage}
        token={rawToken}
        translations={t}
      />
    </AuthPageShell>
  );
}
