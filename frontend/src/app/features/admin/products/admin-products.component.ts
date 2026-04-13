import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/data.services';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="admin-page">
  <div class="admin-page-header">
    <div><h1>Products</h1><p>{{ total() }} products in El-Za3eem store</p></div>
    <button class="btn btn-primary" (click)="openForm()">+ Add Product</button>
  </div>

  <!-- FORM MODAL -->
  @if (showForm()) {
    <div class="modal-overlay" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editId() ? 'Edit Product' : 'Add New Product' }}</h3>
          <button class="modal-close" (click)="closeForm()">✕</button>
        </div>
        <div class="modal-body">
          @if (formError()) { <div class="alert alert-error">{{ formError() }}</div> }
          <div class="form-row">
            <div class="form-group"><label class="form-label">Product Name *</label>
              <input class="form-control" [(ngModel)]="form.name" placeholder="El-Za3eem ..."/></div>
            <div class="form-group"><label class="form-label">Category *</label>
              <select class="form-control" [(ngModel)]="form.category">
                <option value="">Select category</option>
                @for (c of categories(); track c._id) { <option [value]="c._id">{{ c.name }}</option> }
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Description *</label>
            <textarea class="form-control" rows="3" [(ngModel)]="form.description"></textarea></div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Price (EGP) *</label>
              <input class="form-control" type="number" [(ngModel)]="form.price"/></div>
            <div class="form-group"><label class="form-label">Discount Price (0 = none)</label>
              <input class="form-control" type="number" [(ngModel)]="form.discountPrice"/></div>
            <div class="form-group"><label class="form-label">Stock *</label>
              <input class="form-control" type="number" [(ngModel)]="form.stock"/></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Brand</label>
              <input class="form-control" [(ngModel)]="form.brand" placeholder="El-Za3eem"/></div>
            <div class="form-group"><label class="form-label">Tags (comma-separated)</label>
              <input class="form-control" [(ngModel)]="form.tagsStr" placeholder="bags, leather, premium"/></div>
          </div>
          <div class="form-group"><label class="form-label">Image URL *</label>
            <input class="form-control" [(ngModel)]="form.imageUrl" placeholder="https://images.unsplash.com/..."/>
            @if (form.imageUrl) { <img [src]="form.imageUrl" alt="preview" class="img-preview"/> }
          </div>
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" [(ngModel)]="form.isFeatured"/> Featured product
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeForm()">Cancel</button>
          <button class="btn btn-primary" (click)="saveProduct()" [disabled]="saving()">
            {{ saving() ? 'Saving...' : (editId() ? 'Update Product' : 'Add Product') }}
          </button>
        </div>
      </div>
    </div>
  }

  <!-- TABLE -->
  @if (loading()) { <div class="spinner"></div> }
  @else {
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sold</th><th>Featured</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for (p of products(); track p._id) {
            <tr>
              <td>
                <div class="product-cell">
                  <img [src]="p.images[0]?.url" [alt]="p.name" class="table-img"/>
                  <span class="product-cell-name">{{ p.name }}</span>
                </div>
              </td>
              <td><span class="cat-tag">{{ p.category?.name }}</span></td>
              <td>
                @if (p.discountPrice > 0) {
                  <span class="price-discounted">EGP {{ p.discountPrice | number }}</span><br>
                  <span class="price-struck">EGP {{ p.price | number }}</span>
                } @else { EGP {{ p.price | number }} }
              </td>
              <td [class.low-stock]="p.stock < 10">{{ p.stock }}</td>
              <td>{{ p.sold }}</td>
              <td>{{ p.isFeatured ? '⭐' : '—' }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-outline btn-sm" (click)="editProduct(p)">Edit</button>
                  <button class="btn btn-sm" style="background:#fee2e2;color:#991b1b;border:none" (click)="deleteProduct(p._id)">Delete</button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
</div>
  `,
  styles: [`
.admin-page { padding: 32px; max-width: 1200px; }
.admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
.admin-page-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
.admin-page-header p { color: #7a6a52; font-size: 14px; }
.table-wrap { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { background: #f5f0e8; padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #7a6a52; }
.admin-table td { padding: 14px 16px; border-top: 1px solid #f0e8d8; font-size: 14px; vertical-align: middle; }
.product-cell { display: flex; align-items: center; gap: 12px; }
.table-img { width: 48px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.product-cell-name { font-weight: 600; font-size: 13px; }
.cat-tag { background: #f5f0e8; color: #5a4a32; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; }
.price-discounted { font-weight: 700; color: #8b1a1a; }
.price-struck { font-size: 11px; color: #9a8a72; text-decoration: line-through; }
.low-stock { color: #d84315; font-weight: 700; }
.action-btns { display: flex; gap: 6px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: #fff; border-radius: 12px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; border-bottom: 1px solid #e8e0d0; }
.modal-header h3 { font-size: 18px; font-weight: 800; }
.modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #9a8a72; }
.modal-body { padding: 24px 28px; }
.modal-footer { padding: 16px 28px; border-top: 1px solid #e8e0d0; display: flex; justify-content: flex-end; gap: 12px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
.img-preview { width: 100%; max-height: 160px; object-fit: cover; border-radius: 8px; margin-top: 10px; }
  `]
})
export class AdminProductsComponent implements OnInit {
  products   = signal<any[]>([]);
  categories = signal<any[]>([]);
  loading    = signal(true);
  saving     = signal(false);
  showForm   = signal(false);
  editId     = signal<string | null>(null);
  formError  = signal('');
  total      = signal(0);

  form = { name: '', category: '', description: '', price: 0, discountPrice: 0, stock: 0, brand: 'El-Za3eem', tagsStr: '', imageUrl: '', isFeatured: false };

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.load();
    this.categoryService.getAll().subscribe(res => this.categories.set(res.categories));
  }

  load() {
    this.loading.set(true);
    this.productService.getProducts({ limit: 100 }).subscribe(res => {
      this.products.set(res.products);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  openForm() { this.resetForm(); this.showForm.set(true); }
  closeForm() { this.showForm.set(false); this.editId.set(null); this.formError.set(''); }

  editProduct(p: any) {
    this.editId.set(p._id);
    this.form = {
      name: p.name, category: p.category?._id, description: p.description,
      price: p.price, discountPrice: p.discountPrice, stock: p.stock,
      brand: p.brand, tagsStr: p.tags?.join(', '), imageUrl: p.images[0]?.url, isFeatured: p.isFeatured
    };
    this.showForm.set(true);
  }

  saveProduct() {
    if (!this.form.name || !this.form.category || !this.form.price) { this.formError.set('Name, category and price are required'); return; }
    this.saving.set(true);
    const data = {
      ...this.form,
      tags: this.form.tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      images: [{ url: this.form.imageUrl, alt: this.form.name }]
    };
    const req = this.editId()
      ? this.productService.update(this.editId()!, data)
      : this.productService.create(data);

    req.subscribe({
      next: () => { this.saving.set(false); this.closeForm(); this.load(); },
      error: (err) => { this.formError.set(err.error?.message || 'Failed to save'); this.saving.set(false); }
    });
  }

  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe(() => this.load());
  }

  resetForm() { this.form = { name: '', category: '', description: '', price: 0, discountPrice: 0, stock: 0, brand: 'El-Za3eem', tagsStr: '', imageUrl: '', isFeatured: false }; }
}
