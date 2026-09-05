const Catalog = require('../models/Catalog');

exports.list = async (req, res) => {
  const catalogs = await Catalog.find().select('-data').sort({ order: 1, language: 1 }).lean();
  res.json(catalogs);
};

exports.get = async (req, res) => {
  const catalog = await Catalog.findById(req.params.id).lean();
  if (!catalog) return res.status(404).json({ error: 'Catalog not found' });
  res.json(catalog);
};

exports.upsert = async (req, res) => {
  const { title, language, fileName, data } = req.body;
  if (!title?.trim() || !['vi', 'en', 'zh'].includes(language) || !data?.startsWith('data:application/pdf;base64,')) {
    return res.status(400).json({ error: 'Title, language and a PDF file are required' });
  }
  const existing = await Catalog.findOne({ language });
  const catalog = await Catalog.findOneAndUpdate(
    { language },
    { title: title.trim(), language, fileName: fileName || `${language}.pdf`, mimeType: 'application/pdf', data, order: existing?.order ?? ({ vi: 1, en: 2, zh: 3 }[language]) },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).select('-data');
  res.json(catalog);
};

exports.remove = async (req, res) => {
  const result = await Catalog.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: 'Catalog not found' });
  res.json({ ok: true });
};
