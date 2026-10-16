import { clockTimes, totalPrice } from '../../support/commands';

const P = 'flight.forms.i0.units.i0.';
const byId = (id) => cy.get(`[data-testid="${id}"]`, { timeout: 60000 });

class PassengerDetailPage {
  // Dropdown custom Agoda: combobox -> popup label radio (list virtual, negara punya kotak search)
  pick(testId, text) {
    byId(testId).find('button[role="combobox"]').scrollIntoView().click();
    const options = () => cy.get('input[name="dropdown-list-item"]').closest('label').filter(':visible');
    options().should('have.length.gt', 0);
    cy.get('body').then(($b) => {
      if ($b.find('input[placeholder="Search"]:visible').length) {
        cy.get('input[placeholder="Search"]:visible').type(text);
      }
    });
    options().filter((_, el) => el.innerText.trim() === text).first().click();
  }

  fillContact({ firstName, lastName, email, phone }) {
    byId('contact.contactFirstName').type(firstName);
    byId('contact.contactLastName').type(lastName);
    byId('contact.contactEmail').type(email);
    byId('contact.contactPhoneNumber-PhoneNumberDataTestId').type(phone);
  }

  fillPassenger({ firstName, lastName, gender, nationality, dob, passport }) {
    this.pick(`${P}passengerNationality`, nationality);
    byId(`${P}passengerGender`).contains(gender).click();
    byId(`${P}passengerFirstName`).type(firstName);
    byId(`${P}passengerLastName`).type(lastName);
    byId(`${P}passengerDateOfBirth-DateInputDataTestId`).type(dob.day);
    this.pick(`${P}passengerDateOfBirth-MonthInputDataTestId`, dob.month);
    byId(`${P}passengerDateOfBirth-YearInputDataTestId`).type(dob.year);
    byId(`${P}passportNumber`).type(passport.number);
    this.pick(`${P}passportCountryOfIssue`, passport.country);
    byId(`${P}passportExpiryDate-DateInputDataTestId`).type(passport.expiry.day);
    this.pick(`${P}passportExpiryDate-MonthInputDataTestId`, passport.expiry.month);
    byId(`${P}passportExpiryDate-YearInputDataTestId`).type(passport.expiry.year);
  }

  declineTravelProtection() {
    byId('radio-button-option-no').click();
  }

  totalPrice() {
    return totalPrice();
  }

  flightTimes() {
    return byId('flight-slice-item-origin-dest').invoke('text').then(clockTimes);
  }

  continueToPayment() {
    byId('continue-to-payment-button').click();
    // Modal upsell "Upgrade your support level" muncul setelah klik continue
    cy.contains(/^\s*No,\s+thanks\s*$/, { timeout: 30000 }).click();
    cy.location('pathname', { timeout: 60000 }).should('include', '/payment');
  }
}

export default new PassengerDetailPage();
