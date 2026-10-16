import { wholePrice } from '../../support/commands';

const PRICE_BOX = '#corePrice_feature_div, #corePriceDisplay_desktop_feature_div';

class ProductPage {
  title() {
    return cy.get('#productTitle', { timeout: 30000 }).invoke('text').then((t) => t.trim());
  }

  // Harga di buy box; jika tidak ada featured offer, ambil dari panel "See All Buying Options"
  wholePrice() {
    cy.get('#productTitle', { timeout: 30000 });
    return cy.get('body').then(($b) => {
      const box = [...$b.find(PRICE_BOX)].find((el) => /\$\s?\d/.test(el.innerText));
      if (box) return wholePrice(box.innerText);

      cy.contains('a, span', 'See All Buying Options').first().click({ force: true });
      return cy
        .get('#aod-pinned-offer, #aod-offer-list', { timeout: 30000 })
        .should(($els) => expect($els.text()).to.match(/\$\s?\d/))
        .invoke('text')
        .then(wholePrice);
    });
  }
}

export default new ProductPage();
