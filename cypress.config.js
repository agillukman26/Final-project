const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
  },
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 120000,
    chromeWebSecurity: false,
    numTestsKeptInMemory: 0,
    experimentalMemoryManagement: true,
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on) {
      // Halaman YouTube (autoplay video) bikin renderer crash; matikan autoplay & GPU
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push(
            '--autoplay-policy=user-gesture-required',
            '--disable-gpu',
            '--disable-dev-shm-usage'
          );
        }
        return launchOptions;
      });
    },
  },
});
