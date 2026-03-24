import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export const registerSchema = loginSchema.extend({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters long.'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters long.'),
  language: z.enum(['en', 'pl', 'sv']),
  isDarkMode: z.boolean(),
});

export const passwordResetRequestSchema = z.object({
  email: z.email().trim().toLowerCase(),
  language: z.enum(['en', 'pl', 'sv']),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1),
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
