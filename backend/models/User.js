// User model (Mongoose placeholder)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  role: { type: String, default: 'customer' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
