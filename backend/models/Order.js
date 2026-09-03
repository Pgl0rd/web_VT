// Order model (Mongoose placeholder)
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customer: {
    name: String,
    phone: String,
    email: String,
    address: String,
    city: String
  },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number, price: Number }],
  total: Number,
  paymentMethod: String,
  note: String,
  status: { type: String, enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
