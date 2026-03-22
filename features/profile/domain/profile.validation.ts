import { z } from 'zod';

const minimumBirthDate = new Date('1900-01-01T00:00:00.000Z');
const profileLocationSchema = z.object({
  provider: z.literal('google_places'),
  placeId: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
  formattedAddress: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  countryCode: z.string().trim().min(1).nullable(),
  country: z.string().trim().min(1).nullable(),
  region: z.string().trim().min(1).nullable(),
  city: z.string().trim().min(1).nullable(),
  locality: z.string().trim().min(1).nullable(),
  postalCode: z.string().trim().min(1).nullable(),
});

export const updateProfileSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters long.'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters long.'),
  birthDate: z
    .date()
    .min(minimumBirthDate, 'Birth date must be later than January 1, 1900.')
    .max(new Date(), 'Birth date cannot be in the future.')
    .nullable(),
  location: profileLocationSchema.nullable(),
  heightCm: z.number().min(30).max(300).nullable(),
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
