const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:4200', 'https://shopflow-client.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/products',   require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/orders',     require('./routes/order.routes'));
app.use('/api/users',      require('./routes/user.routes'));
app.use('/api/cart',       require('./routes/cart.routes'));

// ── Health check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'ShopFlow API is running',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/products', '/api/categories', '/api/orders', '/api/users', '/api/cart']
  });
});

// ── 404 handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ── Database connection ──────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 ShopFlow API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
