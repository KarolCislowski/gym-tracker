import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { authenticateUser } from '@/features/auth/application/auth.service';

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

        return {
          id: user.id,
          email: user.email,
          isActive: user.isActive,
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
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? token.sub ?? '');
        session.user.tenantDbName = String(token.tenantDbName ?? '');
        session.user.isActive = Boolean(token.isActive);
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
});
