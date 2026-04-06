import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import {
  authenticateUser,
  isUserAllowedToAccessApp,
} from '@/features/auth/application/auth.service';
import {
  findCoreUserSessionStatusById,
  findTenantSettings,
} from '@/features/auth/infrastructure/auth.db';

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
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.tenantDbName = user.tenantDbName;
        token.isActive = user.isActive;
        token.language = user.language;
        token.authInvalidated = false;
      }

      if (!token.userId) {
        return token;
      }

      const currentUser = await findCoreUserSessionStatusById(String(token.userId));

      if (!currentUser || !isUserAllowedToAccessApp(currentUser)) {
        token.authInvalidated = true;
        delete token.userId;
        delete token.tenantDbName;
        delete token.isActive;
        delete token.language;

        return token;
      }

      token.authInvalidated = false;
      token.userId = currentUser.id;
      token.tenantDbName = currentUser.tenantDbName;
      token.isActive = currentUser.isActive;

      return token;
    },
    session({ session, token }) {
      if (token.authInvalidated || !token.userId) {
        return null as never;
      }

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
