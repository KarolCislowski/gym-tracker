import { getTranslations } from '../../shared/i18n/application/i18n.service';

describe('Daily report happy path', () => {
  it('signs in as the Cypress user, creates a daily report, and sees it in history', () => {
    const reportDate = '2026-03-27';

    cy.loginAsCypressUser();

    cy.request('/api/auth/session').then(({ body }) => {
      const translations = getTranslations(body?.user?.language);
      const t = translations.dailyReports;
      const dashboard = translations.dashboard;

      cy.contains('h1', dashboard.welcomeBack).should('be.visible');
      cy.contains('a', dashboard.dailyReports).click();

      cy.contains('h1', t.title).should('be.visible');
      cy.contains('button', t.openComposerLabel).click();

      cy.contains('h2', t.addReportTitle).should('be.visible');

      cy.findByLabel(t.reportDateLabel).clear().type(reportDate);
      cy.findByLabel(t.sleepHoursLabel).clear().type('8');
      cy.findByLabel(t.stepsLabel).clear().type('12345');
      cy.findByLabel(t.waterLitersLabel).clear().type('2.7');
      cy.findByLabel(t.carbsGramsLabel).clear().type('210');
      cy.findByLabel(t.proteinGramsLabel).clear().type('160');
      cy.findByLabel(t.fatGramsLabel).clear().type('65');
      cy.findByLabel(t.bodyWeightLabel).clear().type('79.4');
      cy.findByLabel(t.restingHeartRateLabel).clear().type('52');
      cy.findByLabel(t.notesLabel).clear().type('Cypress test daily report');

      cy.contains('button', t.saveReport).click();

      cy.contains(t.reportCreated).should('be.visible');
      cy.contains(`table[aria-label="${t.title}"] tbody tr`, '12345').should(
        'be.visible',
      );
      cy.contains(`table[aria-label="${t.title}"] tbody tr`, '160 g').should('be.visible');
    });
  });
});
