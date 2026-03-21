/**
 * Supported measurement systems used for presentation-layer conversions.
 */
export const supportedUnitSystems = [
  'metric',
  'imperial_us',
  'imperial_uk',
] as const;

/**
 * Union of supported measurement systems available in user settings.
 */
export type UnitSystem = (typeof supportedUnitSystems)[number];

/**
 * Generic metric display value.
 */
export interface MetricValue {
  system: 'metric';
  unit: string;
  value: number;
}

/**
 * Generic imperial display value.
 */
export interface ImperialValue {
  system: 'imperial_us' | 'imperial_uk';
  unit: string;
  value: number;
}

/**
 * Height represented as feet and inches for imperial presentation.
 */
export interface ImperialHeightValue {
  feet: number;
  inches: number;
  system: 'imperial_us' | 'imperial_uk';
}

/**
 * Body mass represented as stones and pounds for UK imperial presentation.
 */
export interface ImperialStoneValue {
  pounds: number;
  stones: number;
  system: 'imperial_uk';
}
