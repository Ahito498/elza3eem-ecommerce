import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/data.services';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="container hero-content">
    <div class="hero-text">
      <div class="hero-tag">New Collection 2026 · الزعيم</div>
      <h1>Carry Your<br><em>Legacy</em></h1>
      <p>Premium bags, trolleys, shoes and accessories — handcrafted for those who demand excellence. Egypt's most trusted luxury leather brand since 1985.</p>
      <div class="hero-actions">
        <a routerLink="/products" class="btn btn-primary btn-lg">Shop Collection</a>
        <a routerLink="/products" [queryParams]="{category: 'Trolleys'}" class="btn btn-outline-white btn-lg">View Trolleys</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><span class="stat-num">40+</span><span class="stat-lbl">Years of Craft</span></div>
        <div class="stat"><span class="stat-num">18</span><span class="stat-lbl">Premium Products</span></div>
        <div class="stat"><span class="stat-num">6</span><span class="stat-lbl">Collections</span></div>
      </div>
    </div>
    <div class="hero-image">
      <div class="hero-img-wrap">
        <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80" alt="El-Za3eem Collection"/>
        <div class="hero-badge-card">
          <div class="badge-inner">
            <span class="badge-icon">✦</span>
            <span class="badge-text">Genuine Leather</span>
            <span class="badge-sub">Handcrafted in Egypt</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CATEGORIES -->
<section class="section categories-section">
  <div class="container">
    <div class="section-header">
      <p class="section-label">Shop by Category</p>
      <h2 class="section-title">What are you looking <em>for?</em></h2>
    </div>
    <div class="categories-grid">
      @for (cat of categories(); track cat._id) {
        <a [routerLink]="['/products']" [queryParams]="{category: cat.name}" class="cat-card">
          <div class="cat-img">
            <img [src]="cat.image" [alt]="cat.name" loading="lazy"/>
            <div class="cat-overlay"></div>
          </div>
          <div class="cat-info">
            <h3>{{ cat.name }}</h3>
            <span>Shop Now →</span>
          </div>
        </a>
      }
    </div>
  </div>
</section>

<!-- FEATURED PRODUCTS -->
<section class="section featured-section">
  <div class="container">
    <div class="section-header">
      <p class="section-label">Bestsellers</p>
      <h2 class="section-title">Featured <em>Pieces</em></h2>
      <p class="section-sub">Handpicked favourites loved by our customers</p>
    </div>

    @if (loading()) {
      <div class="spinner"></div>
    } @else {
      <div class="products-grid">
        @for (product of featured(); track product._id) {
          <div class="product-card">
            <a [routerLink]="['/products', product._id]" class="product-card-img">
              <img [src]="product.images[0]?.url" [alt]="product.name" loading="lazy"/>
              @if (product.discountPrice > 0) {
                <span class="badge-sale">SALE</span>
              }
              @if (product.isFeatured) {
                <span class="badge-featured">★ Featured</span>
              }
            </a>
            <div class="product-card-body">
              <p class="product-card-cat">{{ product.category?.name }}</p>
              <h3 class="product-card-name">
                <a [routerLink]="['/products', product._id]">{{ product.name }}</a>
              </h3>
              <div class="stars">★★★★★ <span class="review-count">({{ product.numReviews }})</span></div>
              <div class="price-row" style="margin-top:8px">
                @if (product.discountPrice > 0) {
                  <span class="price-current">EGP {{ product.discountPrice | number }}</span>
                  <span class="price-original">EGP {{ product.price | number }}</span>
                } @else {
                  <span class="price-current">EGP {{ product.price | number }}</span>
                }
              </div>
              <button class="btn btn-primary btn-sm btn-block" style="margin-top:12px" (click)="addToCart(product)">
                Add to Cart
              </button>
            </div>
          </div>
        }
      </div>
      <div style="text-align:center;margin-top:48px">
        <a routerLink="/products" class="btn btn-secondary btn-lg">View All Products</a>
      </div>
    }
  </div>
</section>

<!-- BRAND STORY -->
<section class="brand-story">
  <div class="container brand-story-inner">
    <div class="brand-story-images">
      <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80" alt="El-Za3eem craftsmanship" class="story-img-main"/>
      <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80" alt="El-Za3eem trolleys" class="story-img-secondary"/>
    </div>
    <div class="brand-story-text">
      <p class="section-label">Our Story</p>
      <h2 class="section-title">Crafted with <em>Pride</em>,<br>Built to Last</h2>
      <p>Founded in Cairo in 1985, El-Za3eem (الزعيم — "The Leader") began as a small leather workshop in Khan El-Khalili. Four decades later, we are Egypt's most recognized name in premium bags, luggage, and footwear.</p>
      <p style="margin-top:16px">Every El-Za3eem piece is made with full-grain leather, precision stitching, and hardware that stands the test of time. We don't follow trends — we set them.</p>
      <div class="story-badges">
        <div class="story-badge"><span>🏆</span>40+ Years of Excellence</div>
        <div class="story-badge"><span>🇪🇬</span>Proudly Egyptian</div>
        <div class="story-badge"><span>✋</span>Handcrafted Quality</div>
      </div>
      <a routerLink="/products" class="btn btn-primary" style="margin-top:32px">Discover the Collection</a>
    </div>
  </div>
</section>

<!-- WHY EL-ZA3EEM -->
<section class="section why-section">
  <div class="container">
    <div class="section-header">
      <p class="section-label">Why El-Za3eem?</p>
      <h2 class="section-title">The <em>Difference</em> You Feel</h2>
    </div>
    <div class="why-grid">
      <div class="why-card">
        <div class="why-icon">🐃</div>
        <h3>Full-Grain Leather</h3>
        <p>We use only the highest grade full-grain leather — the strongest, most durable cut. It develops a beautiful patina over time.</p>
      </div>
      <div class="why-card">
        <div class="why-icon">✂️</div>
        <h3>Master Craftsmen</h3>
        <p>Every piece is hand-stitched by artisans with 15+ years of experience. No shortcuts, no compromises.</p>
      </div>
      <div class="why-card">
        <div class="why-icon">🔒</div>
        <h3>TSA-Approved Locks</h3>
        <p>All El-Za3eem trolleys ship with certified TSA locks and pass international airline size requirements.</p>
      </div>
      <div class="why-card">
        <div class="why-icon">🔄</div>
        <h3>Free Returns</h3>
        <p>Not happy? Return within 14 days for a full refund, no questions asked. That's the El-Za3eem promise.</p>
      </div>
    </div>
  </div>
</section>
  `,
  styles: [`
.hero {
  min-height: 92vh; position: relative;
  display: flex; align-items: center;
  background: #1a1008; overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 70% at 70% 50%, #2d1508 0%, #1a1008 100%);
}
.hero-content {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 60px; align-items: center; padding: 80px 24px;
}
.hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(139,105,20,.2); border: 1px solid rgba(200,168,50,.3);
  color: #c8a832; font-size: 12px; font-weight: 600; letter-spacing: .08em;
  text-transform: uppercase; padding: 6px 16px; border-radius: 20px;
  margin-bottom: 24px;
}
.hero-text h1 {
  font-size: clamp(48px, 7vw, 82px); font-weight: 800;
  color: #f5f0e8; line-height: .95; letter-spacing: -.03em;
  margin-bottom: 24px;
}
.hero-text h1 em { color: #c8a832; font-style: italic; font-family: 'Instrument Serif', serif; }
.hero-text p { font-size: 17px; color: #9a8a72; line-height: 1.7; margin-bottom: 36px; max-width: 500px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
.btn-outline-white {
  border: 2px solid rgba(255,255,255,.3); color: #f5f0e8;
  background: transparent; transition: all .2s;
}
.btn-outline-white:hover { border-color: #fff; background: rgba(255,255,255,.1); }
.hero-stats { display: flex; gap: 36px; }
.stat { display: flex; flex-direction: column; }
.stat-num { font-size: 28px; font-weight: 800; color: #c8a832; }
.stat-lbl { font-size: 12px; color: #6a5a42; letter-spacing: .04em; }

.hero-image { position: relative; }
.hero-img-wrap { position: relative; border-radius: 12px; overflow: hidden; }
.hero-img-wrap img { width: 100%; aspect-ratio: .85; object-fit: cover; }
.hero-badge-card {
  position: absolute; bottom: 24px; left: -20px;
  background: #fff; border-radius: 10px; padding: 16px 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,.3);
}
.badge-inner { display: flex; flex-direction: column; gap: 2px; }
.badge-icon { color: #8b6914; font-size: 18px; }
.badge-text { font-weight: 800; font-size: 14px; color: #1a1008; }
.badge-sub { font-size: 11px; color: #7a6a52; }

.categories-section { background: #fff; padding: 80px 0; }
.categories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.cat-card {
  position: relative; border-radius: 10px; overflow: hidden;
  text-decoration: none; display: block;
  aspect-ratio: .85; transition: transform .3s;
}
.cat-card:hover { transform: translateY(-4px); }
.cat-img { position: absolute; inset: 0; }
.cat-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
.cat-card:hover .cat-img img { transform: scale(1.06); }
.cat-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(20,10,0,.75) 100%); }
.cat-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; }
.cat-info h3 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
.cat-info span { font-size: 13px; color: #c8a832; font-weight: 600; letter-spacing: .06em; }

.featured-section { padding: 80px 0; background: #faf8f4; }

.brand-story { background: #1a1008; padding: 100px 0; }
.brand-story-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.brand-story-images { position: relative; }
.story-img-main { width: 100%; border-radius: 10px; aspect-ratio: .85; object-fit: cover; }
.story-img-secondary {
  position: absolute; bottom: -30px; right: -20px;
  width: 55%; border-radius: 8px; aspect-ratio: 1;
  object-fit: cover; border: 4px solid #1a1008;
}
.brand-story-text .section-label { color: #c8a832; }
.brand-story-text .section-title { color: #f5f0e8; }
.brand-story-text p { color: #9a8a72; font-size: 15px; line-height: 1.75; }
.story-badges { display: flex; flex-direction: column; gap: 12px; margin-top: 28px; }
.story-badge { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #c8b89a; font-weight: 500; }
.story-badge span { font-size: 20px; }

.why-section { padding: 80px 0; }
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.why-card { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 32px 24px; text-align: center; transition: transform .3s; }
.why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.08); }
.why-icon { font-size: 36px; margin-bottom: 16px; }
.why-card h3 { font-size: 17px; font-weight: 700; margin-bottom: 10px; color: #1a1008; }
.why-card p { font-size: 14px; color: #7a6a52; line-height: 1.65; }

.review-count { font-size: 11px; color: #9a8a72; }

@media (max-width: 900px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; }
  .hero-image { display: none; }
  .hero-stats { justify-content: center; }
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .brand-story-inner { grid-template-columns: 1fr; }
  .story-img-secondary { display: none; }
  .why-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .categories-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .why-grid { grid-template-columns: 1fr; }
}
  `]
})
export class HomeComponent implements OnInit {
  featured  = signal<any[]>([]);
  categories = signal<any[]>([]);
  loading   = signal(true);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getFeatured().subscribe(res => {
      this.featured.set(res.products);
      this.loading.set(false);
    });
    this.categoryService.getAll().subscribe(res => this.categories.set(res.categories));
  }

  addToCart(product: any) {
    this.cartService.addItem(product, 1);
  }
}
