# Rust Market Scraper API with MongoDB

An API to scrape Rust Market items from the Steam Community Market and update prices every 15 days using MongoDB.

## Features

- Scrapes item data from the Rust section of the Steam Community Market.
- Stores item data in a MongoDB database.
- Provides API endpoints to retrieve item data.
- Automatically updates prices every 15 days using a cron job.
- Allows manual triggering of the scraping process via an API endpoint.

## Prerequisites

- Node.js and npm installed.
- MongoDB installed and running.
- Internet connection for scraping data.

## Setup Instructions

1. **Clone the repository** or download the project files.

2. **Navigate to the project directory**:

   ```bash
   cd rust-market-scraper-api
   ```
