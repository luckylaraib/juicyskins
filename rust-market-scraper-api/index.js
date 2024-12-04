// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 6000;
const connectDB = require('./config/db');
const itemRoutes = require('./routes/items');
const { scheduleScraping } = require('./cron/scheduler');

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Use routes
app.use('/items', itemRoutes);

// Start the scheduled scraping
scheduleScraping();

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
