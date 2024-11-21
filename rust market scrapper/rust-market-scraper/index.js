// const puppeteer = require('puppeteer');
// const fs = require('fs');

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// const scrapeRustMarket = async (maxPages = 426) => {
//   const baseUrl = 'https://steamcommunity.com/market/search';
//   let pageNumber = 426;
//   const fileName = 'rust_market_items.json';

//   // Initialize the file with an empty array if it doesn't exist
//   if (!fs.existsSync(fileName)) {
//     fs.writeFileSync(fileName, JSON.stringify([]));
//   }

//   // Read the existing data from the file
//   const existingData = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
//   const itemSet = new Set(existingData.map(item => item.name));

//   // Launch Puppeteer and open a new page
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   while (pageNumber <= maxPages) {
//     try {
//       const start = (pageNumber - 1) * 100;
//       const url = `${baseUrl}?appid=252490#p${pageNumber}_popular_desc`;

//       console.log(`Navigating to URL: ${url}`);

//       // Go to the page
//       await page.goto(url, { waitUntil: 'networkidle2' });
//       await delay(2000); // Allow some time for the page to load

//       // Scroll to the bottom to ensure all items are loaded
//       await autoScroll(page);

//       // Extract data from the page
//       const pageItems = await page.evaluate(() => {
//         const items = [];
//         document.querySelectorAll('.market_listing_row_link').forEach((element) => {
//           const itemName = element.querySelector('.market_listing_item_name')?.textContent?.trim() || '';
//           const itemPrice = element.querySelector('.normal_price .normal_price')?.textContent?.trim() || '';
//           const itemUrl = element.getAttribute('href') || '';

//           items.push({ name: itemName, price: itemPrice, url: itemUrl });
//         });
//         return items;
//       });

//       // Check if no items were found
//       if (pageItems.length === 0) {
//         console.log('No more items found.');
//         break;
//       }

//       // Filter out duplicates
//       const newItems = pageItems.filter(item => !itemSet.has(item.name));

//       // Add new items to the existing data and set
//       existingData.push(...newItems);
//       newItems.forEach(item => itemSet.add(item.name));

//       // Write the updated data back to the file
//       fs.writeFileSync(fileName, JSON.stringify(existingData, null, 2));

//       console.log(`Page ${pageNumber} scraped and saved successfully. Items collected so far: ${existingData.length}`);

//       // Add a delay after every 20 pages
//       if (pageNumber % 20 === 0) {
//         console.log(`Pausing for 3 minutes after scraping page ${pageNumber}...`);
//         checkRepetency(fileName);

//         await delay(180000); // Wait for 3 minutes
//       }

//       pageNumber++;
//       await delay(5000 + Math.random() * 5000); // Random delay between 5-10 seconds
//     } catch (error) {
//       console.error(`Error on page ${pageNumber}: ${error.message}`);
//       // Optionally implement retry logic here
//       break; // Stop on errors for now
//     }
//   }

//   // Close the browser
//   await browser.close();

//   console.log(`Scraping complete. Total items collected: ${existingData.length}`);
// };

// // Function to scroll to the bottom of the page to load all items
// async function autoScroll(page){
//   await page.evaluate(async () => {
//     await new Promise((resolve) => {
//       let totalHeight = 0;
//       const distance = 100;
//       const timer = setInterval(() => {
//         const scrollHeight = document.body.scrollHeight;
//         window.scrollBy(0, distance);
//         totalHeight += distance;

//         if(totalHeight >= scrollHeight){
//           clearInterval(timer);
//           resolve();
//         }
//       }, 200);
//     });
//   });
// }

// scrapeRustMarket();

// // Function to check for duplicates
// const checkRepetency = (jsonFilePath) => {
//   // Read the JSON file
//   const rawData = fs.readFileSync(jsonFilePath);
//   const items = JSON.parse(rawData);

//   // Create a map to count occurrences of each itemName
//   const itemNameCount = {};
//   let duplicates = 0;

//   items.forEach(item => {
//     const itemName = item.name;
//     if (itemNameCount[itemName]) {
//       itemNameCount[itemName]++;
//       duplicates++;
//     } else {
//       itemNameCount[itemName] = 1;
//     }
//   });

//   // Log results
//   if (duplicates > 0) {
//     console.log(`Found ${duplicates} duplicate item(s) in the JSON data:`);
//     for (const [name, count] of Object.entries(itemNameCount)) {
//       if (count > 1) {
//         console.log(`- ${name}: ${count} occurrences`);
//       }
//     }
//   } else {
//     console.log('No duplicates found in the JSON data.');
//   }
// };

const fs = require('fs');

// Function to remove duplicates based on 'url' property
const removeDuplicates = (data) => {
  const uniqueItems = [];
  const urls = new Set();  // Set to track unique URLs

  data.forEach(item => {
    if (!urls.has(item.name)) {
      urls.add(item.name);
      uniqueItems.push(item);
    }
  });

  return uniqueItems;
};

// Read the JSON file
fs.readFile('rust_market_items.json', 'utf8', (err, jsonData) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse the JSON data
  const data = JSON.parse(jsonData);

  // Remove duplicates
  const filteredData = removeDuplicates(data);

  // Write filtered data to a new file
  fs.writeFile('filteredData.json', JSON.stringify(filteredData, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log('Duplicates removed and data saved to filteredData.json');
    }
  });
});

