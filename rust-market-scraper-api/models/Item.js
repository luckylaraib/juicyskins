// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  price: String,
  url: String,
});

module.exports = mongoose.model('Item', ItemSchema);
