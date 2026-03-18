import Link from 'next/link';

import { auth } from '@/auth';
import { getAuthenticatedUserSnapshot } from '@/features/auth/application/auth.service';
import { logoutAction } from '@/features/auth/infrastructure/auth.actions';

export default async function Page() {
  const session = await auth();
  const userSnapshot =
    session?.user?.id && session.user.tenantDbName
      ? await getAuthenticatedUserSnapshot(
          session.user.tenantDbName,
          session.user.id,
        )
      : null;

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <p className='auth-eyebrow'>Gym Tracker</p>
        <h1>Home</h1>
        <h2>About</h2>
        {session?.user ? (
          <>
            <p className='auth-copy'>
              Signed in as <strong>{session.user.email}</strong>.
            </p>
            <p className='auth-copy'>
              Tenant database: <strong>{session.user.tenantDbName}</strong>
            </p>
            {userSnapshot?.profile ? (
              <div className='auth-panel'>
                <h3>Profile</h3>
                <p className='auth-copy'>
                  Name:{' '}
                  <strong>
                    {userSnapshot.profile.firstName}{' '}
                    {userSnapshot.profile.lastName}
                  </strong>
                </p>
                <p className='auth-copy'>
                  Email: <strong>{userSnapshot.profile.email}</strong>
                </p>
              </div>
            ) : null}
            {userSnapshot?.settings ? (
              <div className='auth-panel'>
                <h3>Settings</h3>
                <p className='auth-copy'>
                  Language: <strong>{userSnapshot.settings.language}</strong>
                </p>
                <p className='auth-copy'>
                  Dark mode:{' '}
                  <strong>
                    {userSnapshot.settings.isDarkMode ? 'Enabled' : 'Disabled'}
                  </strong>
                </p>
              </div>
            ) : null}
            <form action={logoutAction}>
              <button className='auth-button' type='submit'>
                Sign out
              </button>
            </form>
          </>
        ) : (
          <div className='auth-links'>
            <Link href='/login'>Sign in</Link>
            <Link href='/register'>Create account</Link>
          </div>
        )}
      </section>
    </main>
  );
}
