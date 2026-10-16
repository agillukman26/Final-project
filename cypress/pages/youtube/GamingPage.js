class GamingPage {
  openTrendingViewAll() {
    cy.get('a[href*="/gaming/trending"]', { timeout: 30000 })
      .filter(':contains("View all")')
      .first()
      .click({ force: true });
    cy.location('pathname', { timeout: 30000 }).should('include', '/gaming/trending');
  }
}

export default new GamingPage();
