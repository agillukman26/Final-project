import { clockTimes } from '../../support/commands';

const CARD = '[data-testid="web-refresh-flights-card"]';

class FlightSearchPage {
  waitForResults() {
    cy.location('pathname', { timeout: 60000 }).should('include', 'results');
    cy.get(CARD, { timeout: 60000 }).should('have.length.gt', 0);
    // Hasil dari beberapa supplier masih berdatangan setelah card pertama muncul
    cy.wait(8000);
  }

  filterAirline(airline) {
    cy.get('[data-testid="show-all-flight-filter-item-airline"]').click({ force: true });
    // Teks item filter berisi nama + harga, mis. "Malaysia Airlines USD 140"
    cy.get('[data-testid="flight-filter-item-airline"]')
      .filter((_, el) => el.innerText.trim().split('\n')[0].trim() === airline)
      .find('input')
      .check({ force: true });
    cy.get(CARD).should(($cards) => {
      expect($cards.length).to.be.gt(0);
      [...$cards].forEach((c) => expect(c.innerText).to.contain(airline));
    });
  }

  // Card dengan jam berangkat paling awal; simpan jam berangkat & tiba sebagai alias
  captureAndSelectEarliest() {
    cy.get(CARD).then(($cards) => {
      const flights = [...$cards].map((el) => {
        const [departure, arrival] = clockTimes(el.innerText);
        return { el, departure, arrival };
      });
      const earliest = flights.reduce((a, b) => (b.departure < a.departure ? b : a));
      cy.wrap(earliest.departure).as('departureTime');
      cy.wrap(earliest.arrival).as('arrivalTime');
      cy.wrap(earliest.el).click();
    });
    cy.get('[data-testid="flight-detail-select-button"]').filter(':visible').first().click();
  }
}

export default new FlightSearchPage();
