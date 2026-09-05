const Category = require('../models/Category');
const Product = require('../models/Product');

exports.list = async (req, res) => {
  const productCounts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const counts = new Map(productCounts.map(item => [item._id, item.count]));
  const existing = await Category.find().lean();
  const knownNames = new Set(existing.map(category => category.name));
  const unordered = existing.filter(category => !Number.isFinite(category.order) || category.order <= 0);
  if (unordered.length) {
    const maxOrder = existing.reduce((max, category) => Math.max(max, category.order || 0), 0);
    await Promise.all(unordered.map((category, index) => Category.findByIdAndUpdate(category._id, { order: maxOrder + index + 1 })));
  }
  const missingNames = [...counts.keys()].filter(name => name && !knownNames.has(name));
  if (missingNames.length) {
    const last = existing.reduce((max, category) => Math.max(max, category.order || 0), 0);
    await Category.insertMany(missingNames.map((name, index) => ({ name, order: last + index + 1 })), { ordered: false });
  }
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
  res.json(categories.map(category => ({ ...category, productCount: counts.get(category.name) || 0 })));
};

exports.create = async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  try {
    const last = await Category.findOne().sort({ order: -1 }).lean();
    res.status(201).json(await Category.create({ name, image: req.body.image || '', order: (last?.order || 0) + 1 }));
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({ error: error.code === 11000 ? 'Category already exists' : error.message });
  }
};

exports.updateByName = async (req, res) => {
  const name = String(req.params.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  const category = await Category.findOneAndUpdate({ name }, { $set: { image: req.body.image || '' } }, { new: true, upsert: true, setDefaultsOnInsert: true });
  res.json(category);
};

exports.remove = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const productCount = await Product.countDocuments({ category: category.name });
  if (productCount) return res.status(409).json({ error: `Category has ${productCount} product(s)` });
  await category.deleteOne();
  res.json({ ok: true });
};

exports.assignProducts = async (req, res) => {
  const name = String(req.params.name || '').trim();
  const productIds = Array.isArray(req.body.productIds) ? req.body.productIds : [];
  if (!name) return res.status(400).json({ error: 'Category name is required' });
  const result = await Product.updateMany({ category: name }, { $set: { category: '' } });
  if (productIds.length) await Product.updateMany({ _id: { $in: productIds } }, { $set: { category: name } });
  res.json({ ok: true, modified: result.modifiedCount });
};

exports.reorder = async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  await Promise.all(ids.map((id, index) => Category.findByIdAndUpdate(id, { order: index + 1 })));
  res.json({ ok: true });
};
