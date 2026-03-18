import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { registerAction } from '@/features/auth/infrastructure/auth.actions';
import {
  getTranslations,
  resolveLanguage,
} from '@/shared/i18n/application/i18n.service';
import { LanguageSwitcher } from '@/shared/i18n/ui/language-switcher';

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
          pathname='/register'
          query={{
            error: params?.error,
          }}
        />
        <p className='auth-eyebrow'>{t.auth.appName}</p>
        <h1>{t.auth.registerTitle}</h1>
        <p className='auth-copy'>{t.auth.registerDescription}</p>
        {params?.error ? <p className='auth-error'>{params.error}</p> : null}
        <form action={registerAction} className='auth-form'>
          <input name='uiLanguage' type='hidden' value={activeLanguage} />
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
          <select
            className='auth-input'
            id='language'
            name='language'
            defaultValue={activeLanguage}
          >
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
          <Link href={`/login?lang=${activeLanguage}`}>{t.auth.signInLink}</Link>
        </p>
      </section>
    </main>
  );
}
