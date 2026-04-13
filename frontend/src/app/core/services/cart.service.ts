import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CartItem {
  product: any; quantity: number; lineTotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadCart());
  readonly items    = this._items.asReadonly();
  readonly count    = computed(() => this._items().reduce((a, i) => a + i.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((a, i) => a + i.lineTotal, 0));

  constructor(private http: HttpClient) {}

  addItem(product: any, qty = 1) {
    const items = [...this._items()];
    const idx = items.findIndex(i => i.product._id === product._id);
    if (idx > -1) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + qty, lineTotal: (items[idx].quantity + qty) * (product.discountPrice || product.price) };
    } else {
      items.push({ product, quantity: qty, lineTotal: qty * (product.discountPrice || product.price) });
    }
    this._items.set(items);
    this.saveCart(items);
  }

  updateQty(productId: string, qty: number) {
    if (qty < 1) { this.removeItem(productId); return; }
    const items = this._items().map(i =>
      i.product._id === productId
        ? { ...i, quantity: qty, lineTotal: qty * (i.product.discountPrice || i.product.price) }
        : i
    );
    this._items.set(items);
    this.saveCart(items);
  }

  removeItem(productId: string) {
    const items = this._items().filter(i => i.product._id !== productId);
    this._items.set(items);
    this.saveCart(items);
  }

  clearCart() { this._items.set([]); localStorage.removeItem('ez_cart'); }

  validate() {
    const items = this._items().map(i => ({ productId: i.product._id, quantity: i.quantity }));
    return this.http.post<any>(`${environment.apiUrl}/cart/validate`, { items });
  }

  private saveCart(items: CartItem[]) { localStorage.setItem('ez_cart', JSON.stringify(items)); }
  private loadCart(): CartItem[] {
    try { return JSON.parse(localStorage.getItem('ez_cart') || '[]'); } catch { return []; }
  }
}
