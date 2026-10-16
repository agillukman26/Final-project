class HomePage {
  visit() {
    // hl=en & gl=US supaya label menu konsisten (Gaming, View all)
    cy.visit(`${Cypress.env('YOUTUBE_URL')}/?hl=en&gl=US`);
  }

  openGamingFromSidebar() {
    cy.get('ytd-guide-section-renderer', { timeout: 30000 }).should('be.visible');
    // Gaming kadang tersembunyi di "Show more" pada bagian Explore
    cy.get('body').then(($b) => {
      if (!$b.find('ytd-guide-entry-renderer a[title="Gaming"]:visible').length) {
        cy.contains('ytd-guide-section-renderer', 'Explore')
          .find('ytd-guide-collapsible-entry-renderer #expander-item')
          .click({ force: true });
      }
    });
    cy.get('ytd-guide-entry-renderer a[title="Gaming"]').filter(':visible').first().click();
    cy.location('pathname', { timeout: 30000 }).should('include', '/gaming');
  }
}

export default new HomePage();
