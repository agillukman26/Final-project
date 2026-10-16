import { wholePrice } from '../../support/commands';

class SearchResultPage {
  sortByPriceHighToLow() {
    // Pakai parameter sort Amazon; dropdown sering tersembunyi/berubah
    cy.location('href').then((href) => {
      const url = new URL(href);
      url.searchParams.set('s', 'price-desc-rank');
      cy.visit(url.toString());
    });
    cy.get('.a-dropdown-prompt', { timeout: 30000 }).should('contain.text', 'High to Low');
  }

  nonSponsoredResults() {
    return cy
      .get('div[data-component-type="s-search-result"]', { timeout: 30000 })
      .filter((_, el) => !/Sponsored/i.test(el.innerText) && !el.classList.contains('AdHolder'));
  }

  // Item paling kanan dari baris pertama yang bukan iklan
  rightmostFirstRowItem() {
    return this.nonSponsoredResults().then(($items) => {
      const firstTop = Math.round($items[0].getBoundingClientRect().top);
      const row = [...$items].filter(
        (el) => Math.abs(Math.round(el.getBoundingClientRect().top) - firstTop) < 20
      );
      const rightmost = row.reduce((a, b) =>
        b.getBoundingClientRect().left > a.getBoundingClientRect().left ? b : a
      );
      return cy.wrap(rightmost);
    });
  }

  captureAndOpenRightmostItem() {
    this.rightmostFirstRowItem().as('item');
    cy.get('@item').find('h2').invoke('text').then((t) => cy.wrap(t.trim()).as('searchName'));
    // Harga utama (.a-price) atau harga "x new offer" jika tidak ada featured offer
    cy.get('@item').invoke('text').then((t) => cy.wrap(wholePrice(t)).as('searchPrice'));
    cy.get('@item').find('h2').closest('a').invoke('removeAttr', 'target').click();
  }
}

export default new SearchResultPage();
