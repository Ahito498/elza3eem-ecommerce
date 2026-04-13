const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/categories/:id/products
router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id, isActive: true })
      .populate('category', 'name slug')
      .sort('-createdAt');
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/categories — admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/categories/:id — admin only
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/categories/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const productCount = await Product.countDocuments({ category: req.params.id, isActive: true });
    if (productCount > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete — ${productCount} products use this category` });
    }
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
