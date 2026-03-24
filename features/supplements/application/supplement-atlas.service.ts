import {
  findSupplementBySlug,
  findSupplements,
} from '../infrastructure/supplement-atlas.db';
import type { Supplement } from '../domain/supplement.types';

/**
 * Returns active atlas supplements sorted by name.
 * @returns A promise resolving to atlas supplements that should be visible in the UI.
 * @remarks Inactive entries are filtered out here so callers can consume a presentation-ready list.
 */
export async function listSupplementAtlas(): Promise<Supplement[]> {
  const supplements = await findSupplements();

  return supplements
    .filter((supplement) => supplement.isActive)
    .sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Returns a single active atlas supplement resolved by slug.
 * @param slug - Stable supplement slug used by the details route.
 * @returns The matching active supplement or `null` when the slug is missing or inactive.
 */
export async function getSupplementAtlasDetails(
  slug: string,
): Promise<Supplement | null> {
  const supplement = await findSupplementBySlug(slug);

  return supplement?.isActive ? supplement : null;
}
