const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const { protect } = require('../middleware/auth.middleware');

// Note: Cart is stored client-side in localStorage for simplicity.
// This endpoint validates products and calculates totals server-side.

// POST /api/cart/validate — validate cart items and return updated prices/stock
router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    if (!items || items.length === 0) {
      return res.json({ success: true, items: [], subtotal: 0 });
    }

    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId)
        .populate('category', 'name')
        .select('name price discountPrice images stock isActive');

      if (!product || !product.isActive) {
        validatedItems.push({ ...item, valid: false, reason: 'Product no longer available' });
        continue;
      }

      const availableQty = Math.min(item.quantity, product.stock);
      const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      validatedItems.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          effectivePrice,
          image: product.images[0]?.url || '',
          stock: product.stock
        },
        quantity: availableQty,
        lineTotal: +(effectivePrice * availableQty).toFixed(2),
        valid: true,
        adjustedQty: availableQty < item.quantity
      });

      subtotal += effectivePrice * availableQty;
    }

    const shippingCost = subtotal >= 100 ? 0 : 9.99;
    const tax = +(subtotal * 0.1).toFixed(2);

    res.json({
      success: true,
      items: validatedItems,
      subtotal: +subtotal.toFixed(2),
      shippingCost,
      tax,
      total: +(subtotal + shippingCost + tax).toFixed(2),
      freeShippingThreshold: 100,
      remainingForFreeShipping: subtotal >= 100 ? 0 : +(100 - subtotal).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
