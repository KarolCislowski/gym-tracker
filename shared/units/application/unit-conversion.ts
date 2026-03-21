import type {
  ImperialHeightValue,
  ImperialStoneValue,
  ImperialValue,
  MetricValue,
  UnitSystem,
} from '../domain/unit-system.types';

const centimetersPerInch = 2.54;
const inchesPerFoot = 12;
const poundsPerKilogram = 2.2046226218;
const poundsPerStone = 14;
const millilitersPerUsFluidOunce = 29.5735295625;
const millilitersPerUkFluidOunce = 28.4130625;

/**
 * Converts a metric length stored in centimeters to a display value.
 * @param centimeters - Length stored in the persistence layer as centimeters.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns A metric or imperial display value for UI rendering.
 * @remarks Imperial output is expressed in inches because this helper targets generic lengths rather than body height.
 */
export function convertLengthFromMetric(
  centimeters: number,
  unitSystem: UnitSystem,
): MetricValue | ImperialValue {
  if (unitSystem === 'metric') {
    return { system: 'metric', unit: 'cm', value: roundTo(centimeters, 1) };
  }

  return {
    system: unitSystem,
    unit: 'in',
    value: roundTo(centimeters / centimetersPerInch, 1),
  };
}

/**
 * Converts a display length value back to metric centimeters.
 * @param input - Length value expressed in the active presentation system.
 * @returns Normalized metric length ready to be stored in the database.
 * @remarks This should be used at the application boundary before persistence, keeping the database metric-only.
 */
export function convertLengthToMetric(
  input:
    | { system: 'metric'; unit: 'cm' | 'm'; value: number }
    | { system: 'imperial_us' | 'imperial_uk'; unit: 'in' | 'ft'; value: number },
): number {
  if (input.system === 'metric') {
    return input.unit === 'm'
      ? roundTo(input.value * 100, 2)
      : roundTo(input.value, 2);
  }

  const inches = input.unit === 'ft' ? input.value * inchesPerFoot : input.value;

  return roundTo(inches * centimetersPerInch, 2);
}

/**
 * Converts a metric height stored in centimeters to a display value.
 * @param centimeters - Height stored in the persistence layer as centimeters.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns A metric height value or an imperial feet-and-inches structure.
 * @remarks Height uses a dedicated imperial representation because it is more natural in UI than raw inches.
 */
export function convertHeightFromMetric(
  centimeters: number,
  unitSystem: UnitSystem,
): MetricValue | ImperialHeightValue {
  if (unitSystem === 'metric') {
    return { system: 'metric', unit: 'cm', value: roundTo(centimeters, 1) };
  }

  const totalInches = Math.round(centimeters / centimetersPerInch);

  return {
    system: unitSystem,
    feet: Math.floor(totalInches / inchesPerFoot),
    inches: totalInches % inchesPerFoot,
  };
}

/**
 * Converts a display height value back to metric centimeters.
 * @param input - Height value expressed in the active presentation system.
 * @returns Normalized metric height ready to be stored in the database.
 * @remarks Use this for user-entered height values coming from forms or calculated application payloads.
 */
export function convertHeightToMetric(
  input:
    | { system: 'metric'; value: number }
    | { system: 'imperial_us' | 'imperial_uk'; feet: number; inches: number },
): number {
  if (input.system === 'metric') {
    return roundTo(input.value, 2);
  }

  const totalInches = input.feet * inchesPerFoot + input.inches;

  return roundTo(totalInches * centimetersPerInch, 2);
}

/**
 * Converts a metric mass stored in kilograms to a display value.
 * @param kilograms - Mass stored in the persistence layer as kilograms.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns A metric or imperial display value for UI rendering.
 * @remarks This helper targets generic mass values and therefore uses pounds for both imperial systems.
 */
export function convertMassFromMetric(
  kilograms: number,
  unitSystem: UnitSystem,
): MetricValue | ImperialValue {
  if (unitSystem === 'metric') {
    return { system: 'metric', unit: 'kg', value: roundTo(kilograms, 1) };
  }

  return {
    system: unitSystem,
    unit: 'lb',
    value: roundTo(kilograms * poundsPerKilogram, 1),
  };
}

/**
 * Converts a display mass value back to metric kilograms.
 * @param input - Mass value expressed in the active presentation system.
 * @returns Normalized metric mass ready to be stored in the database.
 * @remarks UK stone-and-pound input is accepted to support workflows where body-related mass is entered in UK customary units.
 */
export function convertMassToMetric(
  input:
    | { system: 'metric'; unit: 'kg' | 'g'; value: number }
    | { system: 'imperial_us' | 'imperial_uk'; unit: 'lb'; value: number }
    | ImperialStoneValue,
): number {
  if (input.system === 'metric') {
    return input.unit === 'g'
      ? roundTo(input.value / 1000, 3)
      : roundTo(input.value, 3);
  }

  if ('stones' in input) {
    return roundTo(
      ((input.stones * poundsPerStone) + input.pounds) / poundsPerKilogram,
      3,
    );
  }

  return roundTo(input.value / poundsPerKilogram, 3);
}

/**
 * Converts body mass stored in kilograms to a display value.
 * @param kilograms - Body mass stored in the persistence layer as kilograms.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns A metric value, pounds for US imperial, or stones and pounds for UK imperial.
 * @remarks This helper is specialized for body-weight presentation, which differs from generic mass in UK contexts.
 */
export function convertBodyMassFromMetric(
  kilograms: number,
  unitSystem: UnitSystem,
): MetricValue | ImperialValue | ImperialStoneValue {
  if (unitSystem === 'metric') {
    return { system: 'metric', unit: 'kg', value: roundTo(kilograms, 1) };
  }

  const totalPounds = kilograms * poundsPerKilogram;

  if (unitSystem === 'imperial_uk') {
    const roundedPounds = Math.round(totalPounds);

    return {
      system: 'imperial_uk',
      stones: Math.floor(roundedPounds / poundsPerStone),
      pounds: roundedPounds % poundsPerStone,
    };
  }

  return {
    system: 'imperial_us',
    unit: 'lb',
    value: roundTo(totalPounds, 1),
  };
}

/**
 * Converts a display body mass value back to metric kilograms.
 * @param input - Body mass value expressed in the active presentation system.
 * @returns Normalized metric body mass ready to be stored in the database.
 * @remarks Use this instead of the generic mass converter when the UI can emit UK stones and pounds.
 */
export function convertBodyMassToMetric(
  input:
    | { system: 'metric'; value: number }
    | { system: 'imperial_us'; value: number }
    | ImperialStoneValue,
): number {
  if (input.system === 'metric') {
    return roundTo(input.value, 3);
  }

  if ('stones' in input) {
    return roundTo(
      ((input.stones * poundsPerStone) + input.pounds) / poundsPerKilogram,
      3,
    );
  }

  return roundTo(input.value / poundsPerKilogram, 3);
}

/**
 * Converts protein mass stored in metric grams to a display value.
 * @param grams - Protein mass stored in the persistence layer as grams.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns A metric value in grams or an imperial value in ounces.
 * @remarks Protein goals are presented in ounces for both imperial systems because it is more appropriate than pounds at this scale.
 */
export function convertProteinMassFromMetric(
  grams: number,
  unitSystem: UnitSystem,
): MetricValue | ImperialValue {
  if (unitSystem === 'metric') {
    return { system: 'metric', unit: 'g', value: roundTo(grams, 0) };
  }

  return {
    system: unitSystem,
    unit: 'oz',
    value: roundTo(grams / 28.349523125, 1),
  };
}

/**
 * Converts a display protein mass value back to metric grams.
 * @param input - Protein mass value expressed in the active presentation system.
 * @returns Normalized metric protein mass ready to be stored in the database.
 * @remarks Use this when forms expose ounces in imperial systems but persistence remains metric.
 */
export function convertProteinMassToMetric(
  input:
    | { system: 'metric'; value: number }
    | { system: 'imperial_us' | 'imperial_uk'; value: number },
): number {
  if (input.system === 'metric') {
    return roundTo(input.value, 2);
  }

  return roundTo(input.value * 28.349523125, 2);
}

/**
 * Converts hydration stored in metric liters to a display value.
 * @param liters - Hydration amount stored in the persistence layer as liters.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns A metric value in liters or an imperial value in fluid ounces.
 * @remarks This helper preserves liters in the database while exposing more natural inputs in imperial systems.
 */
export function convertHydrationFromMetricLiters(
  liters: number,
  unitSystem: UnitSystem,
): MetricValue | ImperialValue {
  if (unitSystem === 'metric') {
    return { system: 'metric', unit: 'l', value: roundTo(liters, 2) };
  }

  const milliliters = liters * 1000;
  const divisor =
    unitSystem === 'imperial_us'
      ? millilitersPerUsFluidOunce
      : millilitersPerUkFluidOunce;

  return {
    system: unitSystem,
    unit: 'fl oz',
    value: roundTo(milliliters / divisor, 1),
  };
}

/**
 * Converts a display hydration value back to metric liters.
 * @param input - Hydration value expressed in the active presentation system.
 * @returns Normalized metric hydration amount in liters ready to be stored in the database.
 * @remarks Imperial inputs are expected in fluid ounces, while metric input is expected in liters.
 */
export function convertHydrationToMetricLiters(
  input:
    | { system: 'metric'; value: number }
    | { system: 'imperial_us' | 'imperial_uk'; value: number },
): number {
  if (input.system === 'metric') {
    return roundTo(input.value, 3);
  }

  const multiplier =
    input.system === 'imperial_us'
      ? millilitersPerUsFluidOunce
      : millilitersPerUkFluidOunce;

  return roundTo((input.value * multiplier) / 1000, 3);
}

/**
 * Converts a metric volume stored in milliliters to a display value.
 * @param milliliters - Volume stored in the persistence layer as milliliters.
 * @param unitSystem - Preferred measurement system used for presentation.
 * @returns A metric value or an imperial fluid-ounce value for UI rendering.
 * @remarks US and UK imperial systems use different fluid-ounce conversion factors.
 */
export function convertVolumeFromMetric(
  milliliters: number,
  unitSystem: UnitSystem,
): MetricValue | ImperialValue {
  if (unitSystem === 'metric') {
    return { system: 'metric', unit: 'ml', value: roundTo(milliliters, 0) };
  }

  const divisor =
    unitSystem === 'imperial_us'
      ? millilitersPerUsFluidOunce
      : millilitersPerUkFluidOunce;

  return {
    system: unitSystem,
    unit: 'fl oz',
    value: roundTo(milliliters / divisor, 1),
  };
}

/**
 * Converts a display volume value back to metric milliliters.
 * @param input - Volume value expressed in the active presentation system.
 * @returns Normalized metric volume ready to be stored in the database.
 * @remarks This helper preserves the US/UK distinction so fluid-ounce values are converted correctly.
 */
export function convertVolumeToMetric(
  input:
    | { system: 'metric'; unit: 'ml' | 'l'; value: number }
    | { system: 'imperial_us'; unit: 'fl oz'; value: number }
    | { system: 'imperial_uk'; unit: 'fl oz'; value: number },
): number {
  if (input.system === 'metric') {
    return input.unit === 'l'
      ? roundTo(input.value * 1000, 2)
      : roundTo(input.value, 2);
  }

  const multiplier =
    input.system === 'imperial_us'
      ? millilitersPerUsFluidOunce
      : millilitersPerUkFluidOunce;

  return roundTo(input.value * multiplier, 2);
}

/**
 * Rounds a numeric conversion result to a fixed precision.
 * @param value - Raw numeric value produced by a conversion.
 * @param precision - Number of decimal places to preserve.
 * @returns Rounded numeric value.
 * @remarks Centralizing rounding keeps all converters consistent in presentation and normalization behavior.
 */
function roundTo(value: number, precision: number): number {
  const factor = 10 ** precision;

  return Math.round(value * factor) / factor;
}
