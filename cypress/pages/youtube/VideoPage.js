class VideoPage {
  title() {
    return cy.get('ytd-watch-metadata h1 yt-formatted-string', { timeout: 30000 }).should('not.be.empty');
  }

  channelName() {
    return cy.get('ytd-watch-metadata ytd-channel-name a', { timeout: 30000 }).first().should('not.be.empty');
  }
}

export default new VideoPage();
