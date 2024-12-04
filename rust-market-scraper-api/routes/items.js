// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { scrapeRustMarket } = require('../scraper');

// Route to get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a specific item by name
router.get('/:name', async (req, res) => {
  try {
    const item = await Item.findOne({ name: req.params.name });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to trigger manual scraping
router.post('/scrape', async (req, res) => {
  try {
    await scrapeRustMarket();
    res.json({ message: 'Scraping completed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
