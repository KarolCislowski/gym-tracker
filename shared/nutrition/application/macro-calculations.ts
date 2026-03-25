export interface MacroInput {
  carbsGrams: number | null | undefined;
  fatGrams: number | null | undefined;
  proteinGrams: number | null | undefined;
}

/**
 * Calculates calories from protein, carbohydrate, and fat inputs using the
 * standard 4/4/9 kcal-per-gram model.
 * @param input - Candidate macro values that may be partially missing.
 * @returns Rounded calories, or `null` when all macro inputs are empty or zero.
 */
export function calculateCaloriesFromMacros({
  carbsGrams,
  fatGrams,
  proteinGrams,
}: MacroInput): number | null {
  const normalizedProtein = proteinGrams ?? 0;
  const normalizedCarbs = carbsGrams ?? 0;
  const normalizedFat = fatGrams ?? 0;

  if (normalizedProtein === 0 && normalizedCarbs === 0 && normalizedFat === 0) {
    return null;
  }

  return Math.round((normalizedProtein * 4) + (normalizedCarbs * 4) + (normalizedFat * 9));
}
