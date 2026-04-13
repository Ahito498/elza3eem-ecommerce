const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  }],
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sold: { type: Number, default: 0 },
  brand: { type: String, default: '' },
  tags: [String],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sku: { type: String, unique: true, sparse: true }
}, { timestamps: true });

// Update rating on review change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const avg = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.rating = Math.round(avg * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function() {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

module.exports = mongoose.model('Product', productSchema);
