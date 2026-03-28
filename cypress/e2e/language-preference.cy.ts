import { getTranslations } from '../../shared/i18n/application/i18n.service';

describe('Language preference flow', () => {
  it('switches from English to Polish and back to English', () => {
    const en = getTranslations('en');
    const pl = getTranslations('pl');

    cy.loginAsCypressUser();
    cy.request('/api/auth/session').then(({ body }) => {
      const current = getTranslations(body?.user?.language);

      cy.visit('/settings');

      assertSettingsUi(current);
      ensureLanguage(current.settings.languageLabel, current.auth.languageEnglish);
      cy.contains('button', current.settings.savePreferences).click();
      cy.contains(en.settings.preferencesUpdated).should('exist');
      assertSettingsUi(en);

      ensureLanguage(en.settings.languageLabel, en.auth.languagePolish);
      cy.contains('button', en.settings.savePreferences).click();
      cy.contains(pl.settings.preferencesUpdated).should('exist');
      assertSettingsUi(pl);

      ensureLanguage(pl.settings.languageLabel, pl.auth.languageEnglish);
      cy.contains('button', pl.settings.savePreferences).click();
      cy.contains(en.settings.preferencesUpdated).should('exist');
      assertSettingsUi(en);
    });
  });
});

function assertSettingsUi(translations: ReturnType<typeof getTranslations>): void {
  cy.contains('h1', translations.settings.title).should('be.visible');
  cy.contains('button', translations.dashboard.signOut).should('exist');
  cy.contains('a', translations.dashboard.workoutReports).should('exist');
  cy.contains('a', translations.dashboard.dailyReports).should('exist');
  cy.contains('a', translations.dashboard.settings).should('exist');
}

function ensureLanguage(label: string, option: string): void {
  cy.contains('label', label)
    .closest('.MuiFormControl-root')
    .find('[role="combobox"]')
    .first()
    .click();

  cy.get('[role="listbox"]').contains(option).click();
}
