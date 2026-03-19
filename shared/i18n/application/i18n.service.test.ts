import { describe, expect, test } from 'vitest';

import { getTranslations, resolveLanguage } from './i18n.service';

describe('i18n.service', () => {
  /**
   * Verifies that unsupported or missing languages fall back to English.
   */
  test('resolveLanguage falls back to English', () => {
    expect(resolveLanguage()).toBe('en');
    expect(resolveLanguage('de')).toBe('en');
  });

  /**
   * Verifies that dashboard translations use the same fallback strategy as auth translations.
   */
  test('getTranslations returns dashboard translations with English fallback', () => {
    const translations = getTranslations('pl');

    expect(translations.auth.signIn).toBe('Zaloguj się');
    expect(translations.dashboard.overview).toBe('Przegląd');
    expect(translations.dashboard.signOut).toBe('Sign out');
  });
});
