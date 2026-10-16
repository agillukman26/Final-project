class TrendingPage {
  videoCards() {
    return cy.get('ytd-grid-video-renderer, ytd-video-renderer', { timeout: 30000 }).filter(':visible');
  }

  // Simpan title & channel video ke-n (1-based) sebagai alias lalu klik
  captureAndOpenVideo(n) {
    this.videoCards().eq(n - 1).as('video');
    cy.get('@video').find('#video-title').invoke('text').then((t) => cy.wrap(t.trim()).as('trendingTitle'));
    cy.get('@video').find('ytd-channel-name #text').first()
      .invoke('text').then((t) => cy.wrap(t.trim()).as('trendingChannel'));
    cy.get('@video').find('#video-title').click({ force: true });
  }
}

export default new TrendingPage();
