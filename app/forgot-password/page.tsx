import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { auth } from '@/auth';
import { ForgotPasswordForm } from '@/features/auth/ui/forgot-password/forgot-password-form';
import { AuthPageShell } from '@/features/auth/ui/shared/auth-page-shell';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import {
  COLOR_MODE_COOKIE_NAME,
  resolveAppColorMode,
} from '@/shared/theme/application/theme-mode';

interface ForgotPasswordPageProps {
  searchParams?: Promise<{
    error?: string;
    lang?: string;
    sent?: string;
  }>;
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const session = await auth();
  const cookieStore = await cookies();
  const params = searchParams ? await searchParams : undefined;
  const activeLanguage = resolveLanguage(params?.lang);
  const activeColorMode = resolveAppColorMode(
    cookieStore.get(COLOR_MODE_COOKIE_NAME)?.value,
  );
  const t = getTranslations(activeLanguage);

  if (session?.user) {
    redirect('/');
  }

  return (
    <AuthPageShell
      activeColorMode={activeColorMode}
      activeLanguage={activeLanguage}
      pathname='/forgot-password'
      query={{
        error: params?.error,
        sent: params?.sent,
      }}
      subtitle={t.auth.forgotPasswordDescription}
      title={t.auth.forgotPasswordTitle}
      translations={t}
      width='min(100%, 520px)'>
      <ForgotPasswordForm
        activeLanguage={activeLanguage}
        error={params?.error}
        sent={params?.sent}
        translations={t}
      />
    </AuthPageShell>
  );
}
