const express = require('express');
const path = require('path');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const db = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const app = express();
app.use(express.json());

// API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// static frontend (adjust as needed)
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
(async function(){
  await db.connect(process.env.MONGO_URI);
  app.listen(PORT, () => console.log('Server running on port', PORT));
})();
