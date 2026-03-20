export interface UpdateTenantSettingsInput {
  tenantDbName: string;
  language: string;
  isDarkMode: boolean;
}

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountInput {
  userId: string;
  currentPassword: string;
  confirmationEmail: string;
}

export interface CoreUserSecurityDto {
  id: string;
  email: string;
  password: string;
  tenantDbName: string;
}
