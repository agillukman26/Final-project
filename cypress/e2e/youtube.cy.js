import HomePage from '../pages/youtube/HomePage';
import GamingPage from '../pages/youtube/GamingPage';
import TrendingPage from '../pages/youtube/TrendingPage';
import VideoPage from '../pages/youtube/VideoPage';

describe('YouTube - Trending Gaming video', () => {
  beforeEach(() => {
    // Blok stream video: autoplay bikin renderer browser crash & tidak dibutuhkan untuk assertion
    cy.intercept('**googlevideo.com/**', { statusCode: 204, body: '' });
    // Navigasi SPA YouTube (router internal) bikin renderer crash; hentikan event klik link
    // sebelum sampai ke router supaya browser melakukan full page load biasa
    cy.on('window:before:load', (win) => {
      win.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest('a[href]')) e.stopImmediatePropagation();
      }, true);
    });
  });

  it('video trending nomor 3 punya title & channel yang sama di halaman video', () => {
    HomePage.visit();
    HomePage.openGamingFromSidebar();
    GamingPage.openTrendingViewAll();
    TrendingPage.captureAndOpenVideo(3);

    cy.location('pathname', { timeout: 30000 }).should('eq', '/watch');

    cy.get('@trendingTitle').then((title) => {
      VideoPage.title().invoke('text').should((t) => expect(t.trim()).to.eq(title));
    });
    cy.get('@trendingChannel').then((channel) => {
      VideoPage.channelName().invoke('text').should((t) => expect(t.trim()).to.eq(channel));
    });
  });
});
