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

export interface CreateCoreUserRecordInput {
  email: string;
  password: string;
  tenantDbName: string;
}

export interface CreateTenantDatabaseInput {
  tenantDbName: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  language: string;
  isDarkMode: boolean;
}

export interface CoreUserLookupDto {
  id: string;
}

export interface CoreUserAuthDto {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  tenantDbName: string;
}

export interface CreatedCoreUserDto {
  id: string;
  email: string;
  isActive: boolean;
  tenantDbName: string;
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
