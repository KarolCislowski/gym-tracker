import { getTranslations } from '../../shared/i18n/application/i18n.service';

describe('Daily report happy path', () => {
  it('creates, reviews, edits, and deletes a daily report', () => {
    const reportDate = '2026-03-27';
    const createdSteps = '12345';
    const updatedSteps = '15000';
    const createdProtein = '160';
    const updatedProtein = '170';
    const createdNote = 'Cypress test daily report';
    const updatedNote = 'Cypress test daily report updated';

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
      cy.findByLabel(t.stepsLabel).clear().type(createdSteps);
      cy.findByLabel(t.waterLitersLabel).clear().type('2.7');
      cy.findByLabel(t.carbsGramsLabel).clear().type('210');
      cy.findByLabel(t.proteinGramsLabel).clear().type(createdProtein);
      cy.findByLabel(t.fatGramsLabel).clear().type('65');
      cy.findByLabel(t.bodyWeightLabel).clear().type('79.4');
      cy.findByLabel(t.restingHeartRateLabel).clear().type('52');
      cy.findByLabel(t.notesLabel).clear().type(createdNote);

      cy.contains('button', t.saveReport).click();

      cy.contains(t.reportCreated).should('be.visible');
      cy.contains(`table[aria-label="${t.title}"] tbody tr`, createdSteps)
        .should('be.visible')
        .within(() => {
          cy.get('a[aria-label],button[aria-label]')
            .filter((_, element) =>
              element.getAttribute('aria-label')?.startsWith(t.viewDetailsLabel) ?? false,
            )
            .first()
            .click();
        });

      cy.contains('h1', t.detailsTitle).should('be.visible');
      cy.contains(createdNote).should('exist');
      cy.contains(createdSteps).should('exist');
      cy.contains(`${createdProtein} g`).should('exist');

      cy.contains('button', t.openEditLabel).click();
      cy.findByLabel(t.stepsLabel).clear().type(updatedSteps);
      cy.findByLabel(t.proteinGramsLabel).clear().type(updatedProtein);
      cy.findByLabel(t.notesLabel).clear().type(updatedNote);
      cy.contains('button', t.updateReport).click();

      cy.contains(t.reportUpdated).should('be.visible');
      cy.contains(updatedNote).should('exist');
      cy.contains(updatedSteps).should('exist');
      cy.contains(`${updatedProtein} g`).should('exist');

      cy.get('button[aria-label],a[aria-label]')
        .filter((_, element) =>
          element.getAttribute('aria-label')?.startsWith(t.deleteReportLabel) ?? false,
        )
        .first()
        .click();
      cy.contains('[role="dialog"]', t.deleteReportTitle).should('be.visible');
      cy.contains('[role="dialog"]', t.deleteReportDescription).should('be.visible');
      cy.contains('[role="dialog"] button', t.confirmDeleteLabel).click();

      cy.contains('h1', t.title).should('be.visible');
      cy.contains(t.reportDeleted).should('be.visible');
      cy.contains(`table[aria-label="${t.title}"] tbody tr`, updatedSteps).should('not.exist');
      cy.contains(`table[aria-label="${t.title}"] tbody tr`, `${updatedProtein} g`).should(
        'not.exist',
      );
    });
  });
});
