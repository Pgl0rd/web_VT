// Product model (Mongoose)
const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  name: String,
  values: { type: [String], default: [] },
  selections: [{ name: String, value: String }],
  price: Number,
  oldPrice: Number,
  active: { type: Boolean, default: true }
}, { _id: true });

const AttributeSchema = new mongoose.Schema({
  name: String,
  values: { type: [String], default: [] }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  price: Number,
  oldPrice: Number,
  image: String,
  images: { type: [String], default: [] },
  material: String,
  size: String,
  badge: String,
  description: String,
  attributes: { type: [AttributeSchema], default: [] },
  variants: { type: [VariantSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
