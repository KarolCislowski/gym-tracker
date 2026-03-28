import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authenticateUser } from '@/features/auth/application/auth.service';
import { findTenantSettings } from '@/features/auth/infrastructure/auth.db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Email and password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '');
        const password = String(credentials?.password ?? '');
        const user = await authenticateUser({ email, password });

        if (!user) {
          return null;
        }

        const settings = await findTenantSettings(user.tenantDbName);

        return {
          id: user.id,
          email: user.email,
          isActive: user.isActive,
          language: settings?.language ?? 'en',
          tenantDbName: user.tenantDbName,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.tenantDbName = user.tenantDbName;
        token.isActive = user.isActive;
        token.language = user.language;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? token.sub ?? '');
        session.user.tenantDbName = String(token.tenantDbName ?? '');
        session.user.isActive = Boolean(token.isActive);
        session.user.language = String(token.language ?? 'en');
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
});
