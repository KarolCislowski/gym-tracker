import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      isActive: boolean;
      language: string;
      tenantDbName: string;
    };
  }

  interface User {
    id: string;
    isActive: boolean;
    language: string;
    tenantDbName: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    authInvalidated?: boolean;
    userId?: string;
    isActive?: boolean;
    language?: string;
    tenantDbName?: string;
  }
}
