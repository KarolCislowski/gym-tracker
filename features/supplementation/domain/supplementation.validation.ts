import { z } from 'zod';

const supplementAmountUnitSchema = z.enum([
  'mg',
  'g',
  'mcg',
  'ml',
  'capsule',
  'tablet',
  'scoop',
  'softgel',
]);

const supplementStackContextSchema = z.enum([
  'pre_workout',
  'intra_workout',
  'post_workout',
  'morning',
  'evening',
  'with_meal',
  'daily',
  'flexible',
  'custom',
]);

const supplementStackItemSchema = z.object({
  order: z.number().int().min(1),
  supplementId: z.string().trim().min(1),
  supplementSlug: z.string().trim().min(1),
  supplementName: z.string().trim().min(1),
  variantId: z.string().trim().min(1).nullable(),
  variantSlug: z.string().trim().min(1).nullable(),
  variantName: z.string().trim().min(1).nullable(),
  amount: z.number().min(0.01),
  unit: supplementAmountUnitSchema,
  notes: z.string().trim().min(1).nullable(),
});

export const createSupplementStackSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  name: z.string().trim().min(2),
  context: supplementStackContextSchema,
  notes: z.string().trim().min(1).nullable(),
  isFavorite: z.boolean(),
  items: z.array(supplementStackItemSchema).min(1),
});

export const createSupplementIntakeReportSchema = z.object({
  tenantDbName: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  takenAt: z.date(),
  stackId: z.string().trim().min(1).nullable(),
  stackName: z.string().trim().min(1),
  context: supplementStackContextSchema,
  notes: z.string().trim().min(1).nullable(),
  items: z.array(supplementStackItemSchema).min(1),
});
