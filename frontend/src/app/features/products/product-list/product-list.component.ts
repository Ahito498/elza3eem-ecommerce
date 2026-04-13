import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/data.services';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
<div class="page-hero">
  <div class="container">
    <h1>{{ selectedCategory() || 'All Products' }}</h1>
    <p>{{ total() }} items in El-Za3eem's collection</p>
  </div>
</div>

<div class="container shop-layout">
  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="filter-section">
      <h3>Search</h3>
      <input class="form-control" type="text" placeholder="Search products..." [(ngModel)]="searchQuery" (ngModelChange)="onSearch()"/>
    </div>
    <div class="filter-section">
      <h3>Category</h3>
      <div class="filter-options">
        <label class="filter-opt" [class.active]="!selectedCategory()">
          <input type="radio" name="cat" [value]="null" [(ngModel)]="selectedCategory" (change)="applyFilters()"/> All
        </label>
        @for (cat of categories(); track cat._id) {
          <label class="filter-opt" [class.active]="selectedCategory() === cat.name">
            <input type="radio" name="cat" [value]="cat.name" [(ngModel)]="selectedCategory" (change)="applyFilters()"/>
            {{ cat.name }}
          </label>
        }
      </div>
    </div>
    <div class="filter-section">
      <h3>Price Range (EGP)</h3>
      <div class="price-inputs">
        <input class="form-control" type="number" placeholder="Min" [(ngModel)]="minPrice" (change)="applyFilters()"/>
        <span>–</span>
        <input class="form-control" type="number" placeholder="Max" [(ngModel)]="maxPrice" (change)="applyFilters()"/>
      </div>
    </div>
    <div class="filter-section">
      <h3>Sort By</h3>
      <select class="form-control" [(ngModel)]="sortBy" (change)="applyFilters()">
        <option value="-createdAt">Newest First</option>
        <option value="price">Price: Low to High</option>
        <option value="-price">Price: High to Low</option>
        <option value="-rating">Highest Rated</option>
        <option value="-sold">Best Selling</option>
      </select>
    </div>
    <button class="btn btn-outline btn-block" (click)="clearFilters()" style="margin-top:8px">Clear Filters</button>
  </aside>

  <!-- PRODUCTS -->
  <main class="shop-main">
    <div class="shop-toolbar">
      <p class="results-count">{{ total() }} products</p>
    </div>

    @if (loading()) {
      <div class="spinner"></div>
    } @else if (products().length === 0) {
      <div class="empty-state">
        <p style="font-size:48px">🔍</p>
        <h3>No products found</h3>
        <p>Try adjusting your filters</p>
        <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
      </div>
    } @else {
      <div class="products-grid">
        @for (product of products(); track product._id) {
          <div class="product-card">
            <a [routerLink]="['/products', product._id]" class="product-card-img">
              <img [src]="product.images[0]?.url" [alt]="product.name" loading="lazy"/>
              @if (product.discountPrice > 0) {
                <span class="badge-sale">SALE</span>
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
                  <span class="badge-discount">{{ getDiscount(product) }}% OFF</span>
                } @else {
                  <span class="price-current">EGP {{ product.price | number }}</span>
                }
              </div>
              <div class="card-stock" [class.low]="product.stock < 10">
                {{ product.stock > 0 ? (product.stock < 10 ? 'Only ' + product.stock + ' left!' : 'In Stock') : 'Out of Stock' }}
              </div>
              <div class="card-actions">
                <button class="btn btn-primary btn-sm" style="flex:1" (click)="addToCart(product)" [disabled]="product.stock === 0">
                  {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </button>
                <a [routerLink]="['/products', product._id]" class="btn btn-outline btn-sm">View</a>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- PAGINATION -->
      @if (pages() > 1) {
        <div class="pagination">
          <button class="page-btn" [disabled]="currentPage() === 1" (click)="changePage(currentPage() - 1)">← Prev</button>
          @for (p of pageArray(); track p) {
            <button class="page-btn" [class.active]="p === currentPage()" (click)="changePage(p)">{{ p }}</button>
          }
          <button class="page-btn" [disabled]="currentPage() === pages()" (click)="changePage(currentPage() + 1)">Next →</button>
        </div>
      }
    }
  </main>
</div>
  `,
  styles: [`
.shop-layout { display: grid; grid-template-columns: 260px 1fr; gap: 40px; padding-bottom: 80px; }
.sidebar { position: sticky; top: 80px; align-self: start; }
.filter-section { background: #fff; border: 1px solid #e8e0d0; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
.filter-section h3 { font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #5a4a32; margin-bottom: 14px; }
.filter-options { display: flex; flex-direction: column; gap: 8px; }
.filter-opt { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; padding: 6px 10px; border-radius: 6px; transition: background .15s; }
.filter-opt:hover { background: #faf4ec; }
.filter-opt.active { background: #fdf0e0; font-weight: 600; color: #8b1a1a; }
.filter-opt input { accent-color: #8b1a1a; }
.price-inputs { display: flex; align-items: center; gap: 8px; }
.price-inputs span { color: #9a8a72; }
.shop-main { min-width: 0; }
.shop-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.results-count { font-size: 14px; color: #7a6a52; }
.empty-state { text-align: center; padding: 80px 20px; }
.empty-state h3 { font-size: 22px; margin: 16px 0 8px; }
.empty-state > p { color: #9a8a72; margin-bottom: 24px; }
.card-stock { font-size: 11px; font-weight: 600; color: #2e7d32; margin: 6px 0; }
.card-stock.low { color: #d84315; }
.card-actions { display: flex; gap: 8px; margin-top: 10px; }
.review-count { font-size: 11px; color: #9a8a72; }
.pagination { display: flex; gap: 8px; justify-content: center; margin-top: 48px; flex-wrap: wrap; }
.page-btn { padding: 8px 14px; border: 1.5px solid #e8e0d0; background: #fff; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all .2s; }
.page-btn:hover, .page-btn.active { background: #8b1a1a; color: #fff; border-color: #8b1a1a; }
.page-btn:disabled { opacity: .4; cursor: default; }
.badge-sale { position: absolute; top: 12px; left: 12px; background: #8b1a1a; color: #fff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; letter-spacing: .04em; }
@media (max-width: 768px) {
  .shop-layout { grid-template-columns: 1fr; }
  .sidebar { position: static; }
}
  `]
})
export class ProductListComponent implements OnInit {
  products      = signal<any[]>([]);
  categories    = signal<any[]>([]);
  loading       = signal(true);
  total         = signal(0);
  currentPage   = signal(1);
  pages         = signal(1);
  pageArray     = signal<number[]>([]);
  selectedCategory = signal<string | null>(null);

  searchQuery = '';
  minPrice    = '';
  maxPrice    = '';
  sortBy      = '-createdAt';
  private searchTimer: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(res => this.categories.set(res.categories));
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory.set(params['category']);
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading.set(true);
    const filters: any = { page: this.currentPage(), limit: 12, sort: this.sortBy };
    if (this.selectedCategory()) filters.category = this.selectedCategory();
    if (this.searchQuery) filters.search = this.searchQuery;
    if (this.minPrice) filters.minPrice = this.minPrice;
    if (this.maxPrice) filters.maxPrice = this.maxPrice;

    this.productService.getProducts(filters).subscribe(res => {
      this.products.set(res.products);
      this.total.set(res.total);
      this.pages.set(res.pages);
      this.pageArray.set(Array.from({ length: res.pages }, (_, i) => i + 1));
      this.loading.set(false);
    });
  }

  applyFilters() { this.currentPage.set(1); this.loadProducts(); }
  changePage(p: number) { this.currentPage.set(p); this.loadProducts(); window.scrollTo(0, 0); }
  onSearch() { clearTimeout(this.searchTimer); this.searchTimer = setTimeout(() => this.applyFilters(), 400); }
  clearFilters() { this.selectedCategory.set(null); this.searchQuery = ''; this.minPrice = ''; this.maxPrice = ''; this.sortBy = '-createdAt'; this.applyFilters(); }
  addToCart(p: any) { this.cartService.addItem(p, 1); }
  getDiscount(p: any) { return Math.round((1 - p.discountPrice / p.price) * 100); }
}
