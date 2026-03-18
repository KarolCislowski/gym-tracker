import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { loginAction } from '@/features/auth/infrastructure/auth.actions';

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

  if (session?.user) {
    redirect('/');
  }

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <p className='auth-eyebrow'>Gym Tracker</p>
        <h1>Sign in</h1>
        <p className='auth-copy'>
          Use your email address and password to access your tenant workspace.
        </p>
        {params?.registered === '1' ? (
          <p className='auth-success'>
            Your account has been created. You can sign in now.
          </p>
        ) : null}
        {params?.error ? <p className='auth-error'>{params.error}</p> : null}
        <form action={loginAction} className='auth-form'>
          <label className='auth-label' htmlFor='email'>
            Email
          </label>
          <input className='auth-input' id='email' name='email' type='email' required />
          <label className='auth-label' htmlFor='password'>
            Password
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
            Sign in
          </button>
        </form>
        <p className='auth-footer'>
          New here? <Link href='/register'>Create an account</Link>
        </p>
      </section>
    </main>
  );
}
