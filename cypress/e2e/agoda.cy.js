import HomePage from '../pages/agoda/HomePage';
import FlightSearchPage from '../pages/agoda/FlightSearchPage';
import PassengerDetailPage from '../pages/agoda/PassengerDetailPage';
import PaymentPage from '../pages/agoda/PaymentPage';

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

describe('Agoda - Flight Jakarta ke Singapura', () => {
  beforeEach(function () {
    cy.fixture('passenger').then((p) => {
      this.passenger = {
        ...p,
        firstName: Cypress.env('PASSENGER_FIRST_NAME'),
        lastName: Cypress.env('PASSENGER_LAST_NAME'),
        email: Cypress.env('PASSENGER_EMAIL'),
        phone: Cypress.env('PASSENGER_PHONE'),
      };
    });
  });

  it('penerbangan paling awal besok (Malaysia Airlines) tampil sama di halaman pembayaran', function () {
    const { passenger } = this;
    const fullName = `${passenger.firstName} ${passenger.lastName}`;

    HomePage.visit();
    HomePage.searchOneWay(Cypress.env('ORIGIN'), Cypress.env('DESTINATION'), tomorrow());
    FlightSearchPage.waitForResults();
    FlightSearchPage.filterAirline(Cypress.env('AIRLINE'));
    FlightSearchPage.captureAndSelectEarliest();

    PassengerDetailPage.fillContact(passenger);
    PassengerDetailPage.fillPassenger(passenger);
    PassengerDetailPage.declineTravelProtection();
    PassengerDetailPage.totalPrice().as('passengerPageTotal');
    PassengerDetailPage.flightTimes().as('passengerPageTimes');
    PassengerDetailPage.continueToPayment();

    // Total price & data penumpang sama dengan halaman Passenger Details
    cy.get('@passengerPageTotal').then((total) => {
      PaymentPage.totalPrice().should('eq', total);
    });
    PaymentPage.contactName().should('eq', fullName);
    PaymentPage.passengerNames().should('deep.eq', [fullName]);
    PaymentPage.passengerDetails().should('contain', passenger.passport.number);

    // Departure & arrival time sama dengan penerbangan yang dipilih
    cy.get('@departureTime').then((departure) => {
      cy.get('@arrivalTime').then((arrival) => {
        cy.get('@passengerPageTimes').should('deep.eq', [departure, arrival]);
        PaymentPage.flightTimes().should('deep.eq', [departure, arrival]);
      });
    });
  });
});
