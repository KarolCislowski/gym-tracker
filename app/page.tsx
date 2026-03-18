import Link from 'next/link';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { logoutAction } from '@/features/auth/infrastructure/auth.actions';
import { getTranslations } from '@/features/i18n/application/i18n.service';

export default async function Page() {
  const session = await auth();
  const userSnapshot =
    session?.user?.id && session.user.tenantDbName
      ? await getAuthenticatedUserSnapshot(
          session.user.tenantDbName,
          session.user.id,
        )
      : null;
  const t = getTranslations(userSnapshot?.settings?.language);

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <p className='auth-eyebrow'>{t.auth.appName}</p>
        <h1>{t.auth.homeTitle}</h1>
        <h2>{t.auth.aboutTitle}</h2>
        {session?.user ? (
          <>
            <p className='auth-copy'>
              {t.auth.signedInAs} <strong>{session.user.email}</strong>.
            </p>
            <p className='auth-copy'>
              {t.auth.tenantDatabase}:{' '}
              <strong>{session.user.tenantDbName}</strong>
            </p>
            {userSnapshot?.profile ? (
              <div className='auth-panel'>
                <h3>{t.auth.profileTitle}</h3>
                <p className='auth-copy'>
                  {t.auth.profileName}:{' '}
                  <strong>
                    {userSnapshot.profile.firstName}{' '}
                    {userSnapshot.profile.lastName}
                  </strong>
                </p>
                <p className='auth-copy'>
                  {t.auth.profileEmail}:{' '}
                  <strong>{userSnapshot.profile.email}</strong>
                </p>
              </div>
            ) : null}
            {userSnapshot?.settings ? (
              <div className='auth-panel'>
                <h3>{t.auth.settingsTitle}</h3>
                <p className='auth-copy'>
                  {t.auth.settingsLanguage}:{' '}
                  <strong>{userSnapshot.settings.language}</strong>
                </p>
                <p className='auth-copy'>
                  {t.auth.settingsDarkMode}:{' '}
                  <strong>
                    {userSnapshot.settings.isDarkMode
                      ? t.auth.darkModeEnabled
                      : t.auth.darkModeDisabled}
                  </strong>
                </p>
              </div>
            ) : null}
            <form action={logoutAction}>
              <button className='auth-button' type='submit'>
                {t.auth.signOut}
              </button>
            </form>
          </>
        ) : (
          <div className='auth-links'>
            <Link href='/login'>{t.auth.signIn}</Link>
            <Link href='/register'>{t.auth.createAccount}</Link>
          </div>
        )}
      </section>
    </main>
  );
}
