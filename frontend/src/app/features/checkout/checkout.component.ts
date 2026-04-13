import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/data.services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
<div class="page-hero">
  <div class="container"><h1>Checkout</h1></div>
</div>
<div class="container checkout-layout">
  <div class="checkout-form">
    <div class="checkout-section">
      <h3>Shipping Information</h3>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Full Name *</label>
          <input class="form-control" [(ngModel)]="form.fullName" placeholder="Full name"/></div>
        <div class="form-group"><label class="form-label">Phone</label>
          <input class="form-control" [(ngModel)]="form.phone" placeholder="+20 1XX XXX XXXX"/></div>
      </div>
      <div class="form-group"><label class="form-label">Street Address *</label>
        <input class="form-control" [(ngModel)]="form.street" placeholder="Street, building, floor, apartment"/></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">City *</label>
          <input class="form-control" [(ngModel)]="form.city" placeholder="Cairo"/></div>
        <div class="form-group"><label class="form-label">Country *</label>
          <input class="form-control" [(ngModel)]="form.country" placeholder="Egypt"/></div>
        <div class="form-group"><label class="form-label">ZIP Code</label>
          <input class="form-control" [(ngModel)]="form.zip" placeholder="11511"/></div>
      </div>
    </div>
    <div class="checkout-section">
      <h3>Payment Method</h3>
      <div class="payment-options">
        <label class="payment-opt" [class.selected]="form.paymentMethod === 'cash_on_delivery'">
          <input type="radio" [(ngModel)]="form.paymentMethod" value="cash_on_delivery"/>
          💵 Cash on Delivery
        </label>
        <label class="payment-opt" [class.selected]="form.paymentMethod === 'credit_card'">
          <input type="radio" [(ngModel)]="form.paymentMethod" value="credit_card"/>
          💳 Credit / Debit Card
        </label>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Order Notes (optional)</label>
      <textarea class="form-control" rows="3" [(ngModel)]="form.notes" placeholder="Any special instructions..."></textarea>
    </div>

    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }
    <button class="btn btn-primary btn-block btn-lg" (click)="placeOrder()" [disabled]="loading()">
      {{ loading() ? 'Placing Order...' : 'Place Order — EGP ' + orderTotal() }}
    </button>
  </div>

  <div class="order-summary">
    <h3>Order Summary</h3>
    @for (item of cart.items(); track item.product._id) {
      <div class="summary-item">
        <img [src]="item.product.images[0]?.url" [alt]="item.product.name"/>
        <div class="summary-item-info">
          <p class="summary-item-name">{{ item.product.name }}</p>
          <p class="summary-item-qty">Qty: {{ item.quantity }}</p>
        </div>
        <span class="summary-item-price">EGP {{ item.lineTotal | number }}</span>
      </div>
    }
    <div class="summary-totals">
      <div class="sum-row"><span>Subtotal</span><span>EGP {{ cart.subtotal() | number }}</span></div>
      <div class="sum-row"><span>Shipping</span><span>{{ cart.subtotal() >= 1500 ? 'Free' : 'EGP 50' }}</span></div>
      <div class="sum-row total"><span>Total</span><span>EGP {{ orderTotal() | number }}</span></div>
    </div>
  </div>
</div>
  `,
  styles: [`
.checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 40px; padding-bottom: 80px; }
.checkout-section { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 28px; margin-bottom: 20px; }
.checkout-section h3 { font-size: 17px; font-weight: 800; margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
.payment-options { display: flex; flex-direction: column; gap: 10px; }
.payment-opt { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1.5px solid #e8e0d0; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 500; transition: all .2s; }
.payment-opt.selected { border-color: #8b1a1a; background: #fdf0f0; }
.payment-opt input { accent-color: #8b1a1a; }
.order-summary { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 28px; align-self: start; position: sticky; top: 90px; }
.order-summary h3 { font-size: 17px; font-weight: 800; margin-bottom: 20px; }
.summary-item { display: flex; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0e8d8; }
.summary-item img { width: 56px; height: 56px; object-fit: cover; border-radius: 6px; }
.summary-item-name { font-size: 13px; font-weight: 600; }
.summary-item-qty { font-size: 12px; color: #9a8a72; }
.summary-item-price { margin-left: auto; font-weight: 700; font-size: 14px; white-space: nowrap; }
.summary-totals { margin-top: 16px; }
.sum-row { display: flex; justify-content: space-between; font-size: 15px; padding: 8px 0; }
.sum-row.total { font-size: 18px; font-weight: 800; border-top: 2px solid #e8e0d0; padding-top: 16px; margin-top: 8px; color: #8b1a1a; }
@media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } }
  `]
})
export class CheckoutComponent implements OnInit {
  form = {
    fullName: '', phone: '', street: '', city: 'Cairo', country: 'Egypt', zip: '',
    paymentMethod: 'cash_on_delivery', notes: ''
  };
  loading = signal(false);
  error   = signal('');

  constructor(public cart: CartService, private orderService: OrderService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.auth.user();
    if (user) this.form.fullName = user.name;
  }

  orderTotal(): number {
    const sub = this.cart.subtotal();
    return sub + (sub >= 1500 ? 0 : 50);
  }

  placeOrder() {
    const { fullName, street, city, country } = this.form;
    if (!fullName || !street || !city || !country) { this.error.set('Please fill in all required fields'); return; }
    this.loading.set(true); this.error.set('');

    const items = this.cart.items().map(i => ({ product: i.product._id, quantity: i.quantity }));
    const shippingAddress = { fullName, phone: this.form.phone, street, city, country, zip: this.form.zip };
    const sub = this.cart.subtotal();

    this.orderService.place({
      items,
      shippingAddress,
      paymentMethod: this.form.paymentMethod,
      notes: this.form.notes,
      subtotal: sub,
      shippingCost: sub >= 1500 ? 0 : 50,
      totalAmount: this.orderTotal()
    }).subscribe({
      next: (res) => {
        this.cart.clearCart();
        this.router.navigate(['/account'], { queryParams: { tab: 'orders', success: res.order.orderNumber } });
      },
      error: (err) => { this.error.set(err.error?.message || 'Order failed. Please try again.'); this.loading.set(false); }
    });
  }
}
