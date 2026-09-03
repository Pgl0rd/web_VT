const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { signUser } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), phone, address, role: 'customer' });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: signUser(user) });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || '').trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ error: 'Email or password is incorrect' });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: signUser(user) });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.updateMe = async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user.id } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const user = await User.findByIdAndUpdate(req.user.id, { name: name.trim(), email: normalizedEmail, phone, address }, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.list = async (req, res) => res.json(await User.find().select('-password').sort({ createdAt: -1 }));

exports.changeRole = async (req, res) => {
  if (!['customer', 'manager', 'admin'].includes(req.body.role)) return res.status(400).json({ error: 'Invalid role' });
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};
