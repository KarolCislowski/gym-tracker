export interface TenantWorkoutTemplateEntry {
  order: number;
  exerciseId: string;
  exerciseSlug: string;
  variantId?: string | null;
  selectedGrip?: string | null;
  selectedStance?: string | null;
  selectedAttachment?: string | null;
  notes?: string | null;
  restAfterEntrySec?: number | null;
}

export interface TenantWorkoutTemplateBlock {
  order: number;
  type: 'single' | 'superset' | 'circuit' | 'dropset';
  name?: string | null;
  rounds?: number | null;
  restAfterBlockSec?: number | null;
  entries: TenantWorkoutTemplateEntry[];
}

export interface TenantWorkoutTemplate {
  userId: string;
  name: string;
  notes?: string | null;
  blocks: TenantWorkoutTemplateBlock[];
  createdAt: Date;
  updatedAt: Date;
}
