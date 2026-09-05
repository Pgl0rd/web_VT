const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'change-this-development-secret';

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'manager') return res.status(403).json({ error: 'Admin access required' });
  next();
}

function requireAdminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required' });
  next();
}

function signUser(user) {
  return jwt.sign({ id: String(user._id), name: user.name, email: user.email, role: user.role }, secret, { expiresIn: '24h' });
}

module.exports = { authenticate, requireAdmin, requireAdminOnly, signUser };