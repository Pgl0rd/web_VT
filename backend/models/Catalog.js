const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  language: { type: String, enum: ['vi', 'en', 'zh'], required: true, unique: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, default: 'application/pdf' },
  data: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Catalog || mongoose.model('Catalog', CatalogSchema);
