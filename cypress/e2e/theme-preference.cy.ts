import { getTranslations } from '../../shared/i18n/application/i18n.service';

describe('Theme preference flow', () => {
  it('switches from light to dark and back to light', () => {
    cy.loginAsCypressUser();

    cy.request('/api/auth/session').then(({ body }) => {
      const translations = getTranslations(body?.user?.language);
      const dashboard = translations.dashboard;
      const settings = translations.settings;

      cy.contains('h1', dashboard.welcomeBack).should('be.visible');
      cy.contains('a', dashboard.settings).click();

      cy.contains('h1', settings.title).should('be.visible');

      ensureThemeMode(settings.darkModeLabel, false);
      cy.contains('button', settings.savePreferences).click();
      cy.contains(settings.preferencesUpdated).should('exist');
      cy.get('body').should(($body) => {
        const backgroundColor = getComputedStyle($body[0]).backgroundColor;
        expect(backgroundColor).to.not.equal('rgb(18, 18, 18)');
      });

      ensureThemeMode(settings.darkModeLabel, true);
      cy.contains('button', settings.savePreferences).click();
      cy.contains(settings.preferencesUpdated).should('exist');
      cy.get('body').should(($body) => {
        const backgroundColor = getComputedStyle($body[0]).backgroundColor;
        expect(backgroundColor).to.equal('rgb(18, 18, 18)');
      });

      ensureThemeMode(settings.darkModeLabel, false);
      cy.contains('button', settings.savePreferences).click();
      cy.contains(settings.preferencesUpdated).should('exist');
      cy.get('body').should(($body) => {
        const backgroundColor = getComputedStyle($body[0]).backgroundColor;
        expect(backgroundColor).to.not.equal('rgb(18, 18, 18)');
      });
    });
  });
});

function ensureThemeMode(label: string, enabled: boolean): void {
  cy.findCheckboxByLabel(label).then(($checkbox) => {
    const isChecked = $checkbox.is(':checked');

    if (isChecked !== enabled) {
      cy.wrap($checkbox).click({ force: true });
    }
  });
}
