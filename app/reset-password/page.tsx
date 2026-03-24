import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { auth } from '@/auth';
import { ResetPasswordForm } from '@/features/auth/ui/reset-password/reset-password-form';
import { AuthPageShell } from '@/features/auth/ui/shared/auth-page-shell';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import {
  COLOR_MODE_COOKIE_NAME,
  resolveAppColorMode,
} from '@/shared/theme/application/theme-mode';

interface ResetPasswordPageProps {
  searchParams?: Promise<{
    error?: string;
    lang?: string;
    token?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
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
      pathname='/reset-password'
      query={{
        error: params?.error,
        token: params?.token,
      }}
      subtitle={t.auth.resetPasswordDescription}
      title={t.auth.resetPasswordTitle}
      translations={t}
      width='min(100%, 520px)'>
      <ResetPasswordForm
        activeLanguage={activeLanguage}
        error={params?.error}
        token={params?.token}
        translations={t}
      />
    </AuthPageShell>
  );
}
