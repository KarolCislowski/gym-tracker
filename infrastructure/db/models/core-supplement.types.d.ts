import type { Types } from 'mongoose';

export interface CoreSupplementVariant {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  form: 'powder' | 'capsule' | 'tablet' | 'liquid' | 'softgel' | 'other';
  compoundType:
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
  typicalDose: string;
  timing: (
    | 'pre_workout'
    | 'intra_workout'
    | 'post_workout'
    | 'morning'
    | 'evening'
    | 'with_meal'
    | 'daily'
    | 'flexible'
  )[];
  notes?: string[];
  isDefault?: boolean;
}

export interface CoreSupplement {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  aliases?: string[];
  category:
    | 'performance'
    | 'recovery'
    | 'health'
    | 'hydration'
    | 'body_composition';
  evidenceLevel: 'strong' | 'moderate' | 'emerging' | 'limited';
  description?: string;
  goals?: (
    | 'strength'
    | 'power'
    | 'endurance'
    | 'recovery'
    | 'body_composition'
    | 'hydration'
    | 'sleep'
    | 'general_health'
    | 'cognition'
  )[];
  benefits?: string[];
  cautions?: string[];
  tags?: string[];
  variants: CoreSupplementVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
