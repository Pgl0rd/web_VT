// userController.js (placeholder)
const User = require('../models/User');

exports.register = async (req, res) => {
  res.json({ ok: true, msg: 'register placeholder' });
};

exports.login = async (req, res) => {
  res.json({ ok: true, token: 'demo-token' });
};

exports.me = async (req, res) => {
  res.json({ id: 'demo', name: 'Demo User' });
};
