export type SupplementCategory =
  | 'performance'
  | 'recovery'
  | 'health'
  | 'hydration'
  | 'body_composition';

export type SupplementEvidenceLevel =
  | 'strong'
  | 'moderate'
  | 'emerging'
  | 'limited';

export type SupplementGoal =
  | 'strength'
  | 'power'
  | 'endurance'
  | 'recovery'
  | 'body_composition'
  | 'hydration'
  | 'sleep'
  | 'general_health'
  | 'cognition';

export type SupplementForm =
  | 'powder'
  | 'capsule'
  | 'tablet'
  | 'liquid'
  | 'softgel'
  | 'other';

export type SupplementCompoundType =
  | 'monohydrate'
  | 'malate'
  | 'hcl'
  | 'isolate'
  | 'concentrate'
  | 'citrate'
  | 'glycinate'
  | 'bisglycinate'
  | 'carbonate'
  | 'standardized_extract'
  | 'other';

export type SupplementTiming =
  | 'pre_workout'
  | 'intra_workout'
  | 'post_workout'
  | 'morning'
  | 'evening'
  | 'with_meal'
  | 'daily'
  | 'flexible';

export interface SupplementVariant {
  id: string;
  name: string;
  slug: string;
  form: SupplementForm;
  compoundType: SupplementCompoundType;
  typicalDose: string;
  timing: SupplementTiming[];
  notes?: string[];
  isDefault?: boolean;
}

export interface Supplement {
  id: string;
  name: string;
  slug: string;
  aliases?: string[];
  category: SupplementCategory;
  evidenceLevel: SupplementEvidenceLevel;
  description?: string;
  goals?: SupplementGoal[];
  benefits?: string[];
  cautions?: string[];
  tags?: string[];
  variants: SupplementVariant[];
  isActive: boolean;
}
