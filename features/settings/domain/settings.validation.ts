import { z } from 'zod';
import { supportedUnitSystems } from '@/shared/units/domain/unit-system.types';

export const updateTenantSettingsSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  language: z.enum(['en', 'pl', 'sv']),
  isDarkMode: z.boolean(),
  unitSystem: z.enum(supportedUnitSystems),
  trackMenstrualCycle: z.boolean(),
  trackLibido: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    userId: z.string().trim().min(1),
    currentPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'PASSWORD_CONFIRMATION_MISMATCH',
    path: ['confirmPassword'],
  });

export const deleteAccountSchema = z.object({
  userId: z.string().trim().min(1),
  currentPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
  confirmationEmail: z.email().trim().toLowerCase(),
});
