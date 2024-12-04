// cron/scheduler.js
const cron = require('node-cron');
const { scrapeRustMarket } = require('../scraper');

const scheduleScraping = () => {
  // Schedule the scraper to run every 15 days at midnight
  cron.schedule('0 0 */15 * *', async () => {
    console.log('Running scheduled scrape...');
    try {
      await scrapeRustMarket();
      console.log('Scheduled scraping completed successfully');
    } catch (error) {
      console.error('Error during scheduled scraping:', error.message);
    }
  });

  // Optionally, run the scraper immediately when the server starts
  scrapeRustMarket();
};

module.exports = { scheduleScraping };
