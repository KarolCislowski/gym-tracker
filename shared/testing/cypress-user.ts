import type { SupportedLanguage } from '@/shared/i18n/domain/i18n.types';

/**
 * Shared Cypress-user configuration used by the dedicated end-to-end seed and Cypress commands.
 */
export const cypressUser = {
  email: 'cypress@test.com',
  password: 'cypress123',
  language: 'en' as SupportedLanguage,
} as const;
