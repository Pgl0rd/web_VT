const Order = require('../models/Order');
const User = require('../models/User');
const { signUser } = require('../middleware/auth');

exports.create = async (req, res) => {
  try {
    const { customer, items, total, paymentMethod, note } = req.body;
    if (!customer?.name || !customer?.phone || !customer?.address || !items?.length) return res.status(400).json({ error: 'Customer and order details are required' });
    let userId = req.body.userId || null;
    let accountCreated = false;
    let authToken = null;
    if (!userId && customer.email) {
      const user = await User.findOne({ email: customer.email.trim().toLowerCase() });
      if (user) userId = user._id;
      else {
        const temporaryPassword = `${customer.phone.slice(-6)}Nvt!`;
        const bcrypt = require('bcryptjs');
        const created = await User.create({ name: customer.name, email: customer.email.trim().toLowerCase(), password: await bcrypt.hash(temporaryPassword, 12), phone: customer.phone, address: customer.address, role: 'customer' });
        userId = created._id;
        accountCreated = true;
        authToken = signUser(created);
      }
    }
    const order = await Order.create({ userId, customer, items, total, paymentMethod, note });
    res.status(201).json({ order, accountCreated, token: authToken });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Order creation failed' });
  }
};

exports.list = async (req, res) => res.json(await Order.find(req.user.role === 'customer' ? { userId: req.user.id } : {}).sort({ createdAt: -1 }).limit(100));

exports.get = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || (req.user.role === 'customer' && String(order.userId) !== req.user.id)) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

exports.updateStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};
