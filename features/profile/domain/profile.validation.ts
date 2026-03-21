import { z } from 'zod';

export const updateProfileSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters long.'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters long.'),
  age: z.number().int().min(0).max(120).nullable(),
  gender: z
    .enum(['female', 'male', 'other', 'prefer_not_to_say'])
    .nullable(),
  activityLevel: z
    .enum([
      'sedentary',
      'lightly_active',
      'moderately_active',
      'very_active',
      'extra_active',
    ])
    .nullable(),
});
