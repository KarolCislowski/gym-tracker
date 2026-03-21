import { describe, expect, test } from 'vitest';

import {
  convertBodyMassFromMetric,
  convertBodyMassToMetric,
  convertHeightFromMetric,
  convertHeightToMetric,
  convertHydrationFromMetricLiters,
  convertHydrationToMetricLiters,
  convertLengthFromMetric,
  convertLengthToMetric,
  convertMassFromMetric,
  convertMassToMetric,
  convertProteinMassFromMetric,
  convertProteinMassToMetric,
  convertVolumeFromMetric,
  convertVolumeToMetric,
} from './unit-conversion';

describe('unit-conversion', () => {
  test('converts generic length from metric to US imperial and back', () => {
    expect(convertLengthFromMetric(100, 'imperial_us')).toEqual({
      system: 'imperial_us',
      unit: 'in',
      value: 39.4,
    });
    expect(
      convertLengthToMetric({ system: 'imperial_us', unit: 'in', value: 39.4 }),
    ).toBe(100.08);
  });

  test('converts height between metric and imperial feet/inches', () => {
    expect(convertHeightFromMetric(180, 'imperial_uk')).toEqual({
      system: 'imperial_uk',
      feet: 5,
      inches: 11,
    });
    expect(
      convertHeightToMetric({ system: 'imperial_uk', feet: 5, inches: 11 }),
    ).toBe(180.34);
  });

  test('converts generic mass between metric and pounds', () => {
    expect(convertMassFromMetric(10, 'imperial_us')).toEqual({
      system: 'imperial_us',
      unit: 'lb',
      value: 22,
    });
    expect(
      convertMassToMetric({ system: 'imperial_us', unit: 'lb', value: 22 }),
    ).toBe(9.979);
  });

  test('converts body mass to UK stones and pounds', () => {
    expect(convertBodyMassFromMetric(70, 'imperial_uk')).toEqual({
      system: 'imperial_uk',
      stones: 11,
      pounds: 0,
    });
    expect(
      convertBodyMassToMetric({
        system: 'imperial_uk',
        stones: 11,
        pounds: 0,
      }),
    ).toBe(69.853);
  });

  test('converts hydration between liters and imperial fluid ounces', () => {
    expect(convertHydrationFromMetricLiters(2, 'imperial_us')).toEqual({
      system: 'imperial_us',
      unit: 'fl oz',
      value: 67.6,
    });
    expect(
      convertHydrationToMetricLiters({ system: 'imperial_uk', value: 70.4 }),
    ).toBe(2);
  });

  test('converts protein mass between grams and ounces', () => {
    expect(convertProteinMassFromMetric(150, 'imperial_uk')).toEqual({
      system: 'imperial_uk',
      unit: 'oz',
      value: 5.3,
    });
    expect(
      convertProteinMassToMetric({ system: 'imperial_us', value: 5.3 }),
    ).toBe(150.25);
  });

  test('converts volume using US and UK fluid ounces independently', () => {
    expect(convertVolumeFromMetric(500, 'imperial_us')).toEqual({
      system: 'imperial_us',
      unit: 'fl oz',
      value: 16.9,
    });
    expect(convertVolumeFromMetric(500, 'imperial_uk')).toEqual({
      system: 'imperial_uk',
      unit: 'fl oz',
      value: 17.6,
    });
    expect(
      convertVolumeToMetric({
        system: 'imperial_uk',
        unit: 'fl oz',
        value: 17.6,
      }),
    ).toBe(500.07);
  });
});
