import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="page-hero">
  <div class="container"><h1>Your Cart</h1><p>{{ cart.count() }} item(s)</p></div>
</div>

<div class="container cart-layout">
  @if (cart.items().length === 0) {
    <div class="empty-cart">
      <div class="empty-icon">🛍</div>
      <h2>Your cart is empty</h2>
      <p>Discover our collection of premium bags, trolleys and shoes</p>
      <a routerLink="/products" class="btn btn-primary btn-lg">Start Shopping</a>
    </div>
  } @else {
    <div class="cart-items">
      <div class="cart-header">
        <span>Product</span><span>Price</span><span>Qty</span><span>Total</span><span></span>
      </div>
      @for (item of cart.items(); track item.product._id) {
        <div class="cart-row">
          <div class="cart-product">
            <img [src]="item.product.images[0]?.url" [alt]="item.product.name"/>
            <div>
              <h4>{{ item.product.name }}</h4>
              <p>{{ item.product.category?.name }}</p>
              <p class="cart-brand">El-Za3eem</p>
            </div>
          </div>
          <div class="cart-price">
            EGP {{ (item.product.discountPrice || item.product.price) | number }}
          </div>
          <div class="qty-ctrl">
            <button (click)="cart.updateQty(item.product._id, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button (click)="cart.updateQty(item.product._id, item.quantity + 1)">+</button>
          </div>
          <div class="cart-line-total">EGP {{ item.lineTotal | number }}</div>
          <button class="remove-btn" (click)="cart.removeItem(item.product._id)">✕</button>
        </div>
      }
      <div class="cart-footer">
        <button class="btn btn-outline" (click)="cart.clearCart()">Clear Cart</button>
        <a routerLink="/products" class="btn btn-outline">← Continue Shopping</a>
      </div>
    </div>

    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>EGP {{ cart.subtotal() | number }}</span></div>
      <div class="summary-row"><span>Shipping</span><span>{{ cart.subtotal() >= 1500 ? 'Free' : 'EGP 50' }}</span></div>
      @if (cart.subtotal() < 1500) {
        <div class="free-ship-msg">Add EGP {{ (1500 - cart.subtotal()) | number }} more for free shipping!</div>
      }
      <div class="summary-row total-row">
        <span>Total</span>
        <span>EGP {{ (cart.subtotal() + (cart.subtotal() >= 1500 ? 0 : 50)) | number }}</span>
      </div>
      <a routerLink="/checkout" class="btn btn-primary btn-block btn-lg">Proceed to Checkout →</a>
      <div class="secure-msg">🔒 Secure checkout · Free 14-day returns</div>
    </div>
  }
</div>
  `,
  styles: [`
.cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; padding-bottom: 80px; }
.empty-cart { grid-column: 1/-1; text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 64px; margin-bottom: 20px; }
.empty-cart h2 { font-size: 28px; margin-bottom: 12px; }
.empty-cart > p { color: #7a6a52; margin-bottom: 28px; }
.cart-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 40px; gap: 16px; padding: 12px 0; border-bottom: 2px solid #e8e0d0; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #7a6a52; }
.cart-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 40px; gap: 16px; padding: 20px 0; border-bottom: 1px solid #f0e8d8; align-items: center; }
.cart-product { display: flex; gap: 16px; align-items: center; }
.cart-product img { width: 72px; height: 72px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.cart-product h4 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.cart-product p { font-size: 12px; color: #9a8a72; }
.cart-brand { color: #8b1a1a !important; font-weight: 600 !important; }
.cart-price, .cart-line-total { font-size: 15px; font-weight: 600; }
.cart-line-total { color: #8b1a1a; font-weight: 800; }
.qty-ctrl { display: flex; align-items: center; border: 1.5px solid #e8e0d0; border-radius: 6px; overflow: hidden; width: fit-content; }
.qty-ctrl button { width: 30px; height: 30px; background: #f5f0e8; border: none; font-size: 16px; cursor: pointer; }
.qty-ctrl span { width: 36px; text-align: center; font-weight: 700; font-size: 14px; }
.remove-btn { background: none; border: none; color: #c0a090; font-size: 16px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all .2s; }
.remove-btn:hover { background: #fde8e8; color: #c62828; }
.cart-footer { display: flex; gap: 12px; padding-top: 20px; }
.cart-summary { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 28px; align-self: start; position: sticky; top: 90px; }
.cart-summary h3 { font-size: 20px; font-weight: 800; margin-bottom: 20px; }
.summary-row { display: flex; justify-content: space-between; font-size: 15px; padding: 10px 0; border-bottom: 1px solid #f0e8d8; }
.total-row { font-size: 18px; font-weight: 800; border-top: 2px solid #e8e0d0; border-bottom: none; margin-top: 8px; padding-top: 16px; }
.free-ship-msg { font-size: 12px; color: #8b6914; background: #fdf5e0; padding: 8px 12px; border-radius: 6px; margin: 8px 0; text-align: center; }
.cart-summary .btn-primary { margin-top: 20px; margin-bottom: 12px; }
.secure-msg { text-align: center; font-size: 12px; color: #9a8a72; }
@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } .cart-header { display: none; } .cart-row { grid-template-columns: 1fr; } }
  `]
})
export class CartComponent {
  constructor(public cart: CartService) {}
}
