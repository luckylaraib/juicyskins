// scraper.js
const puppeteer = require('puppeteer');
const Item = require('./models/Item');
require('dotenv').config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const maxPages = process.env.MAX_PAGES || 436;
const scrapeRustMarket = async () => {
  const baseUrl = 'https://steamcommunity.com/market/search';
  let pageNumber = 1;

  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  while (pageNumber <= maxPages) {
    try {
      const url = `${baseUrl}?appid=252490#p${pageNumber}_popular_desc`;

      console.log(`Navigating to URL: ${url}`);

      // Go to the page
      await page.goto(url, { waitUntil: 'networkidle2' });
      await delay(2000); // Allow some time for the page to load

      // Scroll to the bottom to ensure all items are loaded
      await autoScroll(page);

      // Extract data from the page
      const pageItems = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.market_listing_row_link').forEach((element) => {
          const itemName = element.querySelector('.market_listing_item_name')?.textContent?.trim() || '';
          const itemPrice = element.querySelector('.normal_price .normal_price')?.textContent?.trim() || '';
          const itemUrl = element.getAttribute('href') || '';

          items.push({ name: itemName, price: itemPrice, url: itemUrl });
        });
        return items;
      });

      // Check if no items were found
      if (pageItems.length === 0) {
        console.log('No more items found.');
        break;
      }

      // Insert or update items in the database
      for (const item of pageItems) {
        await Item.updateOne(
          { name: item.name },
          { $set: { price: item.price, url: item.url } },
          { upsert: true }
        );
      }

      console.log(`Page ${pageNumber} scraped and data updated.`);

      // Optional delay
      pageNumber++;
      await delay(5000 + Math.random() * 5000); // Random delay between 5-10 seconds
    } catch (error) {
      console.error(`Error on page ${pageNumber}: ${error.message}`);
      break; // Stop on errors for now
    }
  }

  // Close the browser
  await browser.close();

  console.log(`Scraping complete.`);
};

// Function to scroll to the bottom of the page
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

module.exports = { scrapeRustMarket };
