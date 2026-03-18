import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { registerAction } from '@/features/auth/infrastructure/auth.actions';
import { getTranslations } from '@/features/i18n/application/i18n.service';

interface RegisterPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
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
        <h1>{t.auth.registerTitle}</h1>
        <p className='auth-copy'>{t.auth.registerDescription}</p>
        {params?.error ? <p className='auth-error'>{params.error}</p> : null}
        <form action={registerAction} className='auth-form'>
          <label className='auth-label' htmlFor='firstName'>
            {t.auth.firstNameLabel}
          </label>
          <input
            className='auth-input'
            id='firstName'
            name='firstName'
            type='text'
            minLength={2}
            required
          />
          <label className='auth-label' htmlFor='lastName'>
            {t.auth.lastNameLabel}
          </label>
          <input
            className='auth-input'
            id='lastName'
            name='lastName'
            type='text'
            minLength={2}
            required
          />
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
          <label className='auth-label' htmlFor='language'>
            {t.auth.languageLabel}
          </label>
          <select className='auth-input' id='language' name='language' defaultValue='en'>
            <option value='en'>{t.auth.languageEnglish}</option>
            <option value='pl'>{t.auth.languagePolish}</option>
            <option value='sv'>{t.auth.languageSwedish}</option>
          </select>
          <label className='auth-checkbox'>
            <input id='isDarkMode' name='isDarkMode' type='checkbox' />
            <span>{t.auth.darkModeLabel}</span>
          </label>
          <button className='auth-button' type='submit'>
            {t.auth.registerButton}
          </button>
        </form>
        <p className='auth-footer'>
          {t.auth.alreadyHaveAccount}{' '}
          <Link href='/login'>{t.auth.signInLink}</Link>
        </p>
      </section>
    </main>
  );
}
