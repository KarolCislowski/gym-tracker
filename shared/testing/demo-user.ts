import type { SupportedLanguage } from '@/shared/i18n/domain/i18n.types';

/**
 * Shared demo-user configuration used by seed scripts and end-to-end tests.
 * Keeping this data in one place ensures that Cypress follows the same setup as the seeded account.
 */
export const demoUser = {
  email: 'user@test.com',
  password: 'pass1234',
  language: 'en' as SupportedLanguage,
} as const;
