require('dotenv').config();

const express = require('express');
const path = require('path');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const db = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json({ limit: '30mb' }));

// API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Serve page files at the site root because navigation uses paths such as /san-pham.html.
app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.get('/api/health', (req, res) => res.json({ ok: true, database: db.connected() ? 'connected' : 'fallback' }));
async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) return;
  const exists = await User.findOne({ email });
  if (!exists) await User.create({ name: 'Administrator', email, password: await bcrypt.hash(password, 12), role: 'admin' });
}
(async function(){
  await db.connect(process.env.MONGO_URI);
  if (db.connected()) await ensureAdmin();
  app.listen(PORT, () => console.log('Server running on port', PORT));
})();
