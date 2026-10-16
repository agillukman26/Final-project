import HomePage from '../pages/amazon/HomePage';
import SearchResultPage from '../pages/amazon/SearchResultPage';
import ProductPage from '../pages/amazon/ProductPage';

describe('Amazon - Search chair', () => {
  beforeEach(() => cy.viewport(1920, 1080));

  it('nama & harga item di halaman detail sama dengan di search page', () => {
    HomePage.visit();
    HomePage.setDeliveryZip(Cypress.env('AMAZON_ZIP'));
    HomePage.search(Cypress.env('SEARCH_KEYWORD'));
    SearchResultPage.sortByPriceHighToLow();
    SearchResultPage.captureAndOpenRightmostItem();

    cy.get('@searchName').then((name) => {
      ProductPage.title().should('eq', name);
    });
    cy.get('@searchPrice').then((price) => {
      ProductPage.wholePrice().should('eq', price);
    });
  });
});
