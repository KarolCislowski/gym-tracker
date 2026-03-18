import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { loginAction } from '@/features/auth/infrastructure/auth.actions';
import { getTranslations } from '@/features/i18n/application/i18n.service';

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
    registered?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const session = await auth();
  const params = searchParams ? await searchParams : undefined;
  const t = getTranslations();

  if (session?.user) {
    redirect('/');
  }

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <p className='auth-eyebrow'>{t.auth.appName}</p>
        <h1>{t.auth.signInTitle}</h1>
        <p className='auth-copy'>{t.auth.signInDescription}</p>
        {params?.registered === '1' ? (
          <p className='auth-success'>{t.auth.registrationSuccess}</p>
        ) : null}
        {params?.error ? <p className='auth-error'>{params.error}</p> : null}
        <form action={loginAction} className='auth-form'>
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
          {t.auth.newHere} <Link href='/register'>{t.auth.createAccountLink}</Link>
        </p>
      </section>
    </main>
  );
}
