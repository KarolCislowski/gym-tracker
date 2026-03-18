import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { auth } from '@/auth';
import { AuthPageShell } from '@/features/auth/ui/shared/auth-page-shell';
import { LoginForm } from '@/features/auth/ui/login/login-form';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import {
  COLOR_MODE_COOKIE_NAME,
  resolveAppColorMode,
} from '@/shared/theme/application/theme-mode';

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
    registered?: string;
    lang?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
      pathname='/login'
      query={{
        error: params?.error,
        registered: params?.registered,
      }}
      subtitle={t.auth.signInDescription}
      title={t.auth.signInTitle}
      translations={t}
      width='min(100%, 560px)'>
      <LoginForm
        activeLanguage={activeLanguage}
        error={params?.error}
        registered={params?.registered}
        translations={t}
      />
    </AuthPageShell>
  );
}
