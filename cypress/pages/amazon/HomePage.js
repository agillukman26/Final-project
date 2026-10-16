class HomePage {
  visit() {
    cy.visit(Cypress.env('AMAZON_URL'));
    // Amazon kadang menampilkan halaman "Continue shopping" sebelum home
    cy.get('body').then(($b) => {
      if ($b.find('button:contains("Continue shopping")').length) {
        cy.contains('button', 'Continue shopping').click();
      }
    });
  }

  // Dari luar US harga disembunyikan ("See options"); set alamat kirim ke ZIP US
  setDeliveryZip(zip) {
    cy.get('#nav-global-location-popover-link', { timeout: 30000 }).click();
    cy.get('#GLUXZipUpdateInput', { timeout: 30000 }).should('be.visible').clear().type(zip);
    cy.intercept('**/address-change**').as('addressChange');
    cy.get('#GLUXZipUpdate').click();
    cy.wait('@addressChange');
    cy.reload();
    cy.get('#glow-ingress-line2', { timeout: 30000 }).should('contain.text', zip);
  }

  search(keyword) {
    cy.get('#twotabsearchtextbox', { timeout: 30000 }).clear().type(`${keyword}{enter}`);
  }
}

export default new HomePage();
