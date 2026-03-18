import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { loginAction } from '@/features/auth/infrastructure/auth.actions';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import { LanguageSwitcher } from '@/shared/i18n/ui/language-switcher';

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
    registered?: string;
    lang?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const session = await auth();
  const params = searchParams ? await searchParams : undefined;
  const activeLanguage = resolveLanguage(params?.lang);
  const t = getTranslations(activeLanguage);

  if (session?.user) {
    redirect('/');
  }

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <LanguageSwitcher
          activeLanguage={activeLanguage}
          pathname='/login'
          query={{
            error: params?.error,
            registered: params?.registered,
          }}
        />
        <p className='auth-eyebrow'>{t.auth.appName}</p>
        <h1>{t.auth.signInTitle}</h1>
        <p className='auth-copy'>{t.auth.signInDescription}</p>
        {params?.registered === '1' ? (
          <p className='auth-success'>{t.auth.registrationSuccess}</p>
        ) : null}
        {params?.error ? <p className='auth-error'>{params.error}</p> : null}
        <form action={loginAction} className='auth-form'>
          <input name='uiLanguage' type='hidden' value={activeLanguage} />
          <label className='auth-label' htmlFor='email'>
            {t.auth.emailLabel}
          </label>
          <input className='auth-input' id='email' name='email' type='email' required />
          <label className='auth-label' htmlFor='password'>
            {t.auth.passwordLabel}
          </label>
          <input
            className='auth-input'
            id='password'
            name='password'
            type='password'
            minLength={8}
            required
          />
          <button className='auth-button' type='submit'>
            {t.auth.signInButton}
          </button>
        </form>
        <p className='auth-footer'>
          {t.auth.newHere}{' '}
          <Link href={`/register?lang=${activeLanguage}`}>
            {t.auth.createAccountLink}
          </Link>
        </p>
      </section>
    </main>
  );
}
