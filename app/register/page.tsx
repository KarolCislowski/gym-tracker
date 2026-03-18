import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { auth } from '@/auth';
import { AuthPageShell } from '@/features/auth/ui/shared/auth-page-shell';
import { RegisterForm } from '@/features/auth/ui/register/register-form';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import {
  COLOR_MODE_COOKIE_NAME,
  resolveAppColorMode,
} from '@/shared/theme/application/theme-mode';

interface RegisterPageProps {
  searchParams?: Promise<{
    error?: string;
    lang?: string;
  }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
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
      pathname='/register'
      query={{
        error: params?.error,
      }}
      subtitle={t.auth.registerDescription}
      title={t.auth.registerTitle}
      translations={t}
      width='min(100%, 520px)'>
      <RegisterForm
        activeLanguage={activeLanguage}
        error={params?.error}
        translations={t}
      />
    </AuthPageShell>
  );
}
