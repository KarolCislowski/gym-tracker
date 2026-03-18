export interface AuthenticatedUser {
  id: string;
  email: string;
  isActive: boolean;
  tenantDbName: string;
}

export interface CredentialsInput {
  email: string;
  password: string;
}

export interface RegisterUserInput extends CredentialsInput {
  firstName: string;
  lastName: string;
  language: string;
  isDarkMode: boolean;
}

export interface TenantProfileSnapshot {
  email: string;
  firstName: string;
  lastName: string;
}

export interface TenantSettingsSnapshot {
  language: string;
  isDarkMode: boolean;
}

export interface AuthenticatedUserSnapshot {
  profile: TenantProfileSnapshot | null;
  settings: TenantSettingsSnapshot | null;
}
