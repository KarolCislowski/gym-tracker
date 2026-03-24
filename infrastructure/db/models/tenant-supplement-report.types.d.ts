import type {
  TenantSupplementAmountUnit,
  TenantSupplementStackContext,
} from './tenant-supplement-stack.types';

export interface TenantSupplementReportItem {
  order: number;
  supplementId: string;
  supplementSlug: string;
  supplementName: string;
  variantId?: string | null;
  variantSlug?: string | null;
  variantName?: string | null;
  amount: number;
  unit: TenantSupplementAmountUnit;
  notes?: string | null;
}

export interface TenantSupplementReport {
  userId: string;
  takenAt: Date;
  stackId?: string | null;
  stackName: string;
  context: TenantSupplementStackContext;
  notes?: string | null;
  items: TenantSupplementReportItem[];
  createdAt: Date;
  updatedAt: Date;
}
