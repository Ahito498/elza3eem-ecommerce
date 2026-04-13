import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
@if (loading()) {
  <div class="spinner" style="padding:120px"></div>
} @else if (product()) {
  <div class="container detail-layout">
    <!-- IMAGES -->
    <div class="detail-images">
      <div class="main-image">
        <img [src]="selectedImage()" [alt]="product()!.name"/>
      </div>
      @if (product()!.images.length > 1) {
        <div class="thumbs">
          @for (img of product()!.images; track img.url) {
            <div class="thumb" [class.active]="selectedImage() === img.url" (click)="selectedImage.set(img.url)">
              <img [src]="img.url" [alt]="img.alt"/>
            </div>
          }
        </div>
      }
    </div>

    <!-- DETAIL -->
    <div class="detail-info">
      <div class="detail-breadcrumb">
        <a routerLink="/">Home</a> / <a routerLink="/products">Shop</a> / {{ product()!.category?.name }}
      </div>
      <span class="detail-cat">{{ product()!.category?.name }}</span>
      <h1 class="detail-name">{{ product()!.name }}</h1>
      <div class="detail-rating">
        <span class="stars">★★★★★</span>
        <span class="detail-reviews">{{ product()!.numReviews }} reviews</span>
        <span class="detail-sold">· {{ product()!.sold }} sold</span>
      </div>

      <div class="detail-price">
        @if (product()!.discountPrice > 0) {
          <span class="price-big">EGP {{ product()!.discountPrice | number }}</span>
          <span class="price-old">EGP {{ product()!.price | number }}</span>
          <span class="badge-save">Save {{ getDiscount() }}%</span>
        } @else {
          <span class="price-big">EGP {{ product()!.price | number }}</span>
        }
      </div>

      <p class="detail-desc">{{ product()!.description }}</p>

      <div class="detail-stock">
        @if (product()!.stock > 0) {
          <span class="in-stock">✓ In Stock</span>
          <span class="stock-count">({{ product()!.stock }} available)</span>
        } @else {
          <span class="out-stock">✗ Out of Stock</span>
        }
      </div>

      <div class="detail-qty">
        <label>Quantity</label>
        <div class="qty-control">
          <button (click)="decreaseQty()">−</button>
          <span>{{ qty() }}</span>
          <button (click)="increaseQty()">+</button>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary btn-lg" style="flex:2" (click)="addToCart()" [disabled]="product()!.stock === 0">
          🛍 Add to Cart
        </button>
        <a routerLink="/cart" class="btn btn-secondary btn-lg" style="flex:1">View Cart</a>
      </div>

      @if (addedMsg()) {
        <div class="alert alert-success">✓ Added to cart!</div>
      }

      <div class="detail-meta">
        <div class="meta-row"><span>Brand</span><strong>El-Za3eem</strong></div>
        @if (product()!.tags?.length) {
          <div class="meta-row"><span>Tags</span><strong>{{ product()!.tags.join(', ') }}</strong></div>
        }
        <div class="meta-row"><span>Free Shipping</span><strong>On orders over EGP 1,500</strong></div>
        <div class="meta-row"><span>Returns</span><strong>14-day free returns</strong></div>
      </div>
    </div>
  </div>

  <!-- REVIEWS -->
  <div class="container reviews-section">
    <h2>Customer Reviews <span>({{ product()!.reviews?.length || 0 }})</span></h2>

    @if (auth.isLoggedIn()) {
      <div class="review-form">
        <h3>Write a Review</h3>
        <div class="form-group">
          <label class="form-label">Rating</label>
          <div class="star-select">
            @for (s of [1,2,3,4,5]; track s) {
              <span [class.selected]="reviewRating >= s" (click)="reviewRating = s">★</span>
            }
          </div>
        </div>
        <div class="form-group">
          <textarea class="form-control" rows="4" placeholder="Share your experience with this product..." [(ngModel)]="reviewComment"></textarea>
        </div>
        <button class="btn btn-primary" (click)="submitReview()" [disabled]="!reviewComment || !reviewRating">Submit Review</button>
      </div>
    }

    <div class="reviews-list">
      @if (!product()!.reviews?.length) {
        <p class="no-reviews">No reviews yet. Be the first to review this product!</p>
      }
      @for (review of product()!.reviews; track review._id) {
        <div class="review-card">
          <div class="review-header">
            <div class="reviewer-avatar">{{ review.name[0] }}</div>
            <div>
              <strong>{{ review.name }}</strong>
              <div class="stars" [style.color]="'#f4a020'">{{ '★'.repeat(review.rating) }}</div>
            </div>
            <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
          </div>
          <p class="review-body">{{ review.comment }}</p>
        </div>
      }
    </div>
  </div>
}
  `,
  styles: [`
.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; padding: 48px 24px 60px; }
.detail-images .main-image { aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: #f5f0e8; }
.detail-images .main-image img { width: 100%; height: 100%; object-fit: cover; }
.thumbs { display: flex; gap: 10px; margin-top: 12px; }
.thumb { width: 72px; height: 72px; border-radius: 6px; overflow: hidden; border: 2px solid transparent; cursor: pointer; }
.thumb.active { border-color: #8b1a1a; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.detail-breadcrumb { font-size: 13px; color: #9a8a72; margin-bottom: 16px; }
.detail-breadcrumb a { color: #8b1a1a; text-decoration: none; }
.detail-cat { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #8b6914; }
.detail-name { font-size: 32px; font-weight: 800; margin: 8px 0 16px; line-height: 1.1; }
.detail-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; font-size: 14px; color: #7a6a52; }
.detail-reviews { color: #8b1a1a; cursor: pointer; }
.detail-price { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; }
.price-big { font-size: 36px; font-weight: 800; color: #8b1a1a; }
.price-old { font-size: 20px; color: #9a8a72; text-decoration: line-through; }
.badge-save { background: #8b6914; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 4px; }
.detail-desc { font-size: 15px; line-height: 1.75; color: #5a4a32; margin-bottom: 24px; }
.detail-stock { margin-bottom: 20px; font-size: 14px; font-weight: 600; }
.in-stock { color: #2e7d32; } .out-stock { color: #c62828; }
.stock-count { color: #9a8a72; font-size: 13px; }
.detail-qty label { font-size: 13px; font-weight: 600; color: #5a4a32; margin-bottom: 8px; display: block; }
.qty-control { display: flex; align-items: center; gap: 0; border: 1.5px solid #e8e0d0; border-radius: 8px; overflow: hidden; width: fit-content; margin-bottom: 20px; }
.qty-control button { width: 40px; height: 40px; background: #f5f0e8; border: none; font-size: 18px; cursor: pointer; transition: background .2s; }
.qty-control button:hover { background: #e8d8c0; }
.qty-control span { width: 48px; text-align: center; font-weight: 700; font-size: 16px; }
.detail-actions { display: flex; gap: 12px; margin-bottom: 16px; }
.detail-meta { border-top: 1px solid #e8e0d0; padding-top: 20px; margin-top: 20px; }
.meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0e8d8; font-size: 14px; }
.meta-row span { color: #9a8a72; } .meta-row strong { color: #1a1008; }
.reviews-section { padding: 0 24px 80px; }
.reviews-section h2 { font-size: 26px; font-weight: 800; margin-bottom: 32px; }
.reviews-section h2 span { color: #9a8a72; font-size: 18px; }
.review-form { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 28px; margin-bottom: 32px; }
.review-form h3 { font-size: 17px; font-weight: 700; margin-bottom: 20px; }
.star-select { display: flex; gap: 6px; font-size: 28px; cursor: pointer; color: #d0c0a0; }
.star-select span.selected { color: #f4a020; }
.review-card { background: #fff; border: 1px solid #e8e0d0; border-radius: 8px; padding: 20px; margin-bottom: 12px; }
.review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.reviewer-avatar { width: 40px; height: 40px; background: #8b1a1a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
.review-date { margin-left: auto; font-size: 12px; color: #9a8a72; }
.review-body { font-size: 14px; color: #5a4a32; line-height: 1.65; }
.no-reviews { color: #9a8a72; font-size: 15px; padding: 32px 0; }
@media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; } }
  `]
})
export class ProductDetailComponent implements OnInit {
  product      = signal<any>(null);
  loading      = signal(true);
  selectedImage = signal<string>('');
  qty          = signal(1);
  addedMsg     = signal(false);
  reviewRating = 0;
  reviewComment = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cartService: CartService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.productService.getById(p['id']).subscribe(res => {
        this.product.set(res.product);
        this.selectedImage.set(res.product.images[0]?.url);
        this.loading.set(false);
      });
    });
  }

  increaseQty() { if (this.qty() < this.product()!.stock) this.qty.update(q => q + 1); }
  decreaseQty() { if (this.qty() > 1) this.qty.update(q => q - 1); }
  getDiscount() { const p = this.product()!; return Math.round((1 - p.discountPrice / p.price) * 100); }

  addToCart() {
    this.cartService.addItem(this.product(), this.qty());
    this.addedMsg.set(true);
    setTimeout(() => this.addedMsg.set(false), 3000);
  }

  submitReview() {
    this.productService.addReview(this.product()!._id, { rating: this.reviewRating, comment: this.reviewComment }).subscribe(() => {
      this.reviewComment = '';
      this.reviewRating = 0;
      this.productService.getById(this.product()!._id).subscribe(res => this.product.set(res.product));
    });
  }
}
