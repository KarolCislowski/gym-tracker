import type { SupplementTiming } from '@/features/supplements/domain/supplement.types';

export type SupplementAmountUnit =
  | 'mg'
  | 'g'
  | 'mcg'
  | 'ml'
  | 'capsule'
  | 'tablet'
  | 'scoop'
  | 'softgel';

export type SupplementStackContext = SupplementTiming | 'custom';

export interface SupplementStackItemInput {
  order: number;
  supplementId: string;
  supplementSlug: string;
  supplementName: string;
  variantId: string | null;
  variantSlug: string | null;
  variantName: string | null;
  amount: number;
  unit: SupplementAmountUnit;
  notes: string | null;
}

export interface CreateSupplementStackInput {
  tenantDbName: string;
  userId: string;
  name: string;
  context: SupplementStackContext;
  notes: string | null;
  isFavorite: boolean;
  items: SupplementStackItemInput[];
}

export interface SupplementStackSummary {
  id: string;
  name: string;
  context: SupplementStackContext;
  notes: string | null;
  isFavorite: boolean;
  itemCount: number;
  items: SupplementStackItemInput[];
}

export interface CreateSupplementIntakeReportInput {
  tenantDbName: string;
  userId: string;
  takenAt: Date;
  stackId: string | null;
  stackName: string;
  context: SupplementStackContext;
  notes: string | null;
  items: SupplementStackItemInput[];
}

export interface SupplementIntakeReportSummary {
  id: string;
  takenAt: string;
  stackId: string | null;
  stackName: string;
  context: SupplementStackContext;
  notes: string | null;
  itemCount: number;
  items: SupplementStackItemInput[];
}
