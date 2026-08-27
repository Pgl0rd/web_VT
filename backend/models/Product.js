// Product model (Mongoose)
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  price: Number,
  oldPrice: Number,
  image: String,
  material: String,
  size: String,
  badge: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
