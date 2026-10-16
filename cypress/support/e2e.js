import './commands';

// Situs pihak ketiga sering melempar error JS sendiri; jangan gagalkan test karenanya.
Cypress.on('uncaught:exception', () => false);

// Iklan & tracker bikin event load halaman tidak pernah selesai; blok di semua test
const BLOCKED = [
  'doubleclick.net', 'googlesyndication.com', 'googletagmanager.com', 'google-analytics.com',
  'amazon-adsystem.com', 'bing.com', 'facebook.net', 'accounts.google.com', 'run.app',
];
beforeEach(() => {
  BLOCKED.forEach((host) => cy.intercept(`**://*${host}/**`, { statusCode: 204, body: '' }));
});
