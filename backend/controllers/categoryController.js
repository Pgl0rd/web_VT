const Category = require('../models/Category');
const Product = require('../models/Product');

exports.list = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  const productCounts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const counts = new Map(productCounts.map(item => [item._id, item.count]));
  const knownNames = new Set(categories.map(category => category.name));
  const legacyCategories = [...counts.keys()].filter(name => name && !knownNames.has(name)).map(name => ({ name, productCount: counts.get(name), legacy: true }));
  res.json([...categories.map(category => ({ ...category, productCount: counts.get(category.name) || 0 })), ...legacyCategories].sort((a, b) => a.name.localeCompare(b.name)));
};

exports.create = async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  try {
    res.status(201).json(await Category.create({ name }));
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({ error: error.code === 11000 ? 'Category already exists' : error.message });
  }
};

exports.remove = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const productCount = await Product.countDocuments({ category: category.name });
  if (productCount) return res.status(409).json({ error: `Category has ${productCount} product(s)` });
  await category.deleteOne();
  res.json({ ok: true });
};
