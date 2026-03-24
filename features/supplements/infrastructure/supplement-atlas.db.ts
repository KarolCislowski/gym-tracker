import { getCoreSupplementModel } from '@/infrastructure/db/models/core-supplement.model';

import type {
  Supplement,
  SupplementCategory,
  SupplementCompoundType,
  SupplementEvidenceLevel,
  SupplementForm,
  SupplementGoal,
  SupplementTiming,
} from '../domain/supplement.types';

/**
 * Loads all supplement definitions from the shared Core atlas.
 * @returns A promise resolving to mapped supplement definitions from Core.
 */
export async function findSupplements(): Promise<Supplement[]> {
  const CoreSupplementModel = await getCoreSupplementModel();
  const supplements = await CoreSupplementModel.find().lean();

  return supplements.map(mapSupplement);
}

/**
 * Loads a single supplement definition from the shared Core atlas by slug.
 * @param slug - Stable supplement slug.
 * @returns A mapped supplement definition or `null` when it does not exist.
 */
export async function findSupplementBySlug(
  slug: string,
): Promise<Supplement | null> {
  const CoreSupplementModel = await getCoreSupplementModel();
  const supplement = await CoreSupplementModel.findOne({ slug }).lean();

  return supplement ? mapSupplement(supplement) : null;
}

function mapSupplement(supplement: {
  _id: { toString(): string };
  name: string;
  slug: string;
  aliases?: string[];
  category: string;
  evidenceLevel: string;
  description?: string;
  goals?: string[];
  benefits?: string[];
  cautions?: string[];
  tags?: string[];
  variants?: Array<{
    _id: { toString(): string };
    name: string;
    slug: string;
    form: string;
    compoundType: string;
    typicalDose: string;
    timing: string[];
    notes?: string[];
    isDefault?: boolean;
  }>;
  isActive: boolean;
}): Supplement {
  return {
    id: supplement._id.toString(),
    name: supplement.name,
    slug: supplement.slug,
    aliases: supplement.aliases ?? undefined,
    category: supplement.category as SupplementCategory,
    evidenceLevel: supplement.evidenceLevel as SupplementEvidenceLevel,
    description: supplement.description ?? undefined,
    goals: supplement.goals as SupplementGoal[] | undefined,
    benefits: supplement.benefits ?? undefined,
    cautions: supplement.cautions ?? undefined,
    tags: supplement.tags ?? undefined,
    variants: (supplement.variants ?? []).map((variant) => ({
      id: variant._id.toString(),
      name: variant.name,
      slug: variant.slug,
      form: variant.form as SupplementForm,
      compoundType: variant.compoundType as SupplementCompoundType,
      typicalDose: variant.typicalDose,
      timing: variant.timing as SupplementTiming[],
      notes: variant.notes ?? undefined,
      isDefault: variant.isDefault ?? undefined,
    })),
    isActive: supplement.isActive,
  };
}
