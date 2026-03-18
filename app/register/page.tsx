import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { registerAction } from '@/features/auth/infrastructure/auth.actions';

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

  if (session?.user) {
    redirect('/');
  }

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <p className='auth-eyebrow'>Gym Tracker</p>
        <h1>Create account</h1>
        <p className='auth-copy'>
          A Core user record and a dedicated tenant database will be created
          for your account.
        </p>
        {params?.error ? <p className='auth-error'>{params.error}</p> : null}
        <form action={registerAction} className='auth-form'>
          <label className='auth-label' htmlFor='firstName'>
            First name
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
            Last name
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
          <label className='auth-label' htmlFor='language'>
            Language
          </label>
          <select className='auth-input' id='language' name='language' defaultValue='en'>
            <option value='en'>English</option>
            <option value='pl'>Polish</option>
          </select>
          <label className='auth-checkbox'>
            <input id='isDarkMode' name='isDarkMode' type='checkbox' />
            <span>Enable dark mode by default</span>
          </label>
          <button className='auth-button' type='submit'>
            Register
          </button>
        </form>
        <p className='auth-footer'>
          Already have an account? <Link href='/login'>Sign in</Link>
        </p>
      </section>
    </main>
  );
}
