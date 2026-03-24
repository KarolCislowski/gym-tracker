import {
  findSupplementBySlug,
  findSupplements,
} from '../infrastructure/supplement-atlas.db';
import type { Supplement } from '../domain/supplement.types';

/**
 * Returns active atlas supplements sorted by name.
 */
export async function listSupplementAtlas(): Promise<Supplement[]> {
  const supplements = await findSupplements();

  return supplements
    .filter((supplement) => supplement.isActive)
    .sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Returns a single active atlas supplement resolved by slug.
 */
export async function getSupplementAtlasDetails(
  slug: string,
): Promise<Supplement | null> {
  const supplement = await findSupplementBySlug(slug);

  return supplement?.isActive ? supplement : null;
}
