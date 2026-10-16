const SUGGESTION = '[data-selenium="autosuggest-item"], [data-testid="autosuggest-item"]';
const SEARCH_BUTTON =
  '[data-selenium="flight-search"], [data-testid="flight-search"], [data-element-name="flight-search"]';

class HomePage {
  // Paksa currency IDR: halaman pembayaran selalu tampil dalam Rupiah, harga harus sebanding
  visit() {
    cy.visit(`${Cypress.env('AGODA_URL')}/flights?locale=en-us&currency=IDR`);
  }

  selectCity(input, city) {
    cy.get(input, { timeout: 30000 }).click().type(city);
    cy.get(SUGGESTION).should('contain.text', city).first().click();
  }

  // Default form flight adalah one-way; tanggal format YYYY-MM-DD
  searchOneWay(origin, destination, date) {
    this.selectCity('#flight-origin-search-input', origin);
    this.selectCity('#flight-destination-search-input', destination);
    cy.get(`td[data-day="${date}"] button`).click();
    cy.get(SEARCH_BUTTON).first().click();
  }
}

export default new HomePage();
