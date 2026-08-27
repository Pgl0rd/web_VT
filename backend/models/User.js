// User model (Mongoose placeholder)
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'customer' }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
