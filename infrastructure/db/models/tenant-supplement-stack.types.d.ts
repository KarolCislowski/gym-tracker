export type TenantSupplementAmountUnit =
  | 'mg'
  | 'g'
  | 'mcg'
  | 'ml'
  | 'capsule'
  | 'tablet'
  | 'scoop'
  | 'softgel';

export type TenantSupplementStackContext =
  | 'pre_workout'
  | 'intra_workout'
  | 'post_workout'
  | 'morning'
  | 'evening'
  | 'with_meal'
  | 'daily'
  | 'flexible'
  | 'custom';

export interface TenantSupplementStackItem {
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

export interface TenantSupplementStack {
  userId: string;
  name: string;
  context: TenantSupplementStackContext;
  notes?: string | null;
  isFavorite: boolean;
  items: TenantSupplementStackItem[];
  createdAt: Date;
  updatedAt: Date;
}
