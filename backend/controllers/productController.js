// productController.js
const db = require('../config/database');
let Product;
if (db.connected()) {
  Product = require('../models/Product');
}
const store = require('../data/store');

exports.list = async (req, res) => {
  try {
    if (db.connected()) {
      const products = await Product.find().limit(100);
      return res.json(products);
    }
    const products = await store.list();
    return res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    if (db.connected()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Not found' });
      return res.json(product);
    }
    const product = await store.get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    return res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    if (db.connected()) {
      const p = new Product(req.body);
      await p.save();
      return res.status(201).json(p);
    }
    const p = await store.create(req.body);
    return res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

exports.update = async (req, res) => {
  try {
    if (db.connected()) {
      const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(p);
    }
    const p = await store.update(req.params.id, req.body);
    return res.json(p);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

exports.remove = async (req, res) => {
  try {
    if (db.connected()) {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ ok: true });
    }
    const ok = await store.remove(req.params.id);
    return res.json({ ok });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
