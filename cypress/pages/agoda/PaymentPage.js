import { clockTimes, totalPrice } from '../../support/commands';

const NAME = '[data-component="name-container-name"]';
const PASSENGERS = '[data-component="passenger-summary-list"]';

class PaymentPage {
  contactName() {
    return cy.get(NAME, { timeout: 60000 }).first().invoke('text').then((t) => t.trim());
  }

  passengerNames() {
    return cy
      .get(`${PASSENGERS} ${NAME}`, { timeout: 60000 })
      .then(($els) => [...$els].map((el) => el.textContent.trim()));
  }

  passengerDetails() {
    return cy.get(PASSENGERS).invoke('text');
  }

  totalPrice() {
    return totalPrice();
  }

  flightTimes() {
    return cy.get('[data-testid="flight-slice-item-origin-dest"]').invoke('text').then(clockTimes);
  }
}

export default new PaymentPage();
