import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/data.services';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
<div class="page-hero">
  <div class="container"><h1>My Account</h1><p>Welcome back, {{ auth.user()?.name }}</p></div>
</div>
<div class="container account-layout">
  <aside class="account-sidebar">
    <div class="account-avatar">{{ auth.user()?.name?.[0] }}</div>
    <p class="account-name">{{ auth.user()?.name }}</p>
    <p class="account-email">{{ auth.user()?.email }}</p>
    <nav class="account-nav">
      <button [class.active]="tab()==='orders'" (click)="tab.set('orders')">📦 My Orders</button>
      <button [class.active]="tab()==='profile'" (click)="tab.set('profile')">👤 Profile</button>
    </nav>
    <button class="btn btn-outline btn-block" style="margin-top:20px" (click)="auth.logout()">Sign Out</button>
  </aside>

  <main class="account-main">
    @if (successMsg()) {
      <div class="alert alert-success">✓ Order {{ successMsg() }} placed successfully! We'll process it shortly.</div>
    }

    @if (tab() === 'orders') {
      <h2>My Orders</h2>
      @if (ordersLoading()) { <div class="spinner"></div> }
      @else if (orders().length === 0) {
        <div class="empty-orders">
          <p style="font-size:48px">📦</p>
          <h3>No orders yet</h3>
          <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
        </div>
      } @else {
        @for (order of orders(); track order._id) {
          <div class="order-card">
            <div class="order-card-header">
              <div>
                <p class="order-card-num">{{ order.orderNumber }}</p>
                <p class="order-card-date">{{ order.createdAt | date:'MMMM d, y' }}</p>
              </div>
              <div style="text-align:right">
                <span class="order-badge" [class]="order.orderStatus">{{ order.orderStatus }}</span>
                <p style="font-size:16px;font-weight:800;color:#8b1a1a;margin-top:4px">EGP {{ order.totalAmount | number }}</p>
              </div>
            </div>
            <div class="order-items-preview">
              @for (item of order.items; track item.product) {
                <div class="order-item-chip">
                  <img [src]="item.image" [alt]="item.name"/>
                  <span>{{ item.name }} × {{ item.quantity }}</span>
                </div>
              }
            </div>
          </div>
        }
      }
    }

    @if (tab() === 'profile') {
      <h2>Profile Settings</h2>
      <div class="profile-form">
        <div class="form-group"><label class="form-label">Full Name</label>
          <input class="form-control" [(ngModel)]="profileName"/></div>
        <div class="form-group"><label class="form-label">Email</label>
          <input class="form-control" [value]="auth.user()?.email" disabled/></div>
        <button class="btn btn-primary">Save Changes</button>
      </div>
    }
  </main>
</div>
  `,
  styles: [`
.account-layout { display: grid; grid-template-columns: 260px 1fr; gap: 40px; padding-bottom: 80px; }
.account-sidebar { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 28px; align-self: start; position: sticky; top: 88px; text-align: center; }
.account-avatar { width: 72px; height: 72px; background: #8b1a1a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; margin: 0 auto 12px; }
.account-name { font-size: 17px; font-weight: 800; margin-bottom: 4px; }
.account-email { font-size: 13px; color: #9a8a72; margin-bottom: 20px; }
.account-nav { display: flex; flex-direction: column; gap: 4px; text-align: left; }
.account-nav button { background: none; border: none; padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; text-align: left; transition: all .15s; }
.account-nav button:hover { background: #f5f0e8; }
.account-nav button.active { background: #fde8e8; color: #8b1a1a; font-weight: 700; }
.account-main h2 { font-size: 24px; font-weight: 800; margin-bottom: 24px; }
.order-card { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
.order-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0e8d8; }
.order-card-num { font-weight: 800; color: #8b1a1a; font-size: 15px; }
.order-card-date { font-size: 13px; color: #9a8a72; }
.order-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: capitalize; }
.order-badge.pending    { background: #fef3cd; color: #8b6914; }
.order-badge.processing { background: #dbeafe; color: #1d4ed8; }
.order-badge.shipped    { background: #ede9fe; color: #6d28d9; }
.order-badge.delivered  { background: #d1fae5; color: #065f46; }
.order-badge.cancelled  { background: #fee2e2; color: #991b1b; }
.order-items-preview { display: flex; flex-direction: column; gap: 10px; }
.order-item-chip { display: flex; align-items: center; gap: 10px; }
.order-item-chip img { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; }
.order-item-chip span { font-size: 13px; font-weight: 500; }
.empty-orders { text-align: center; padding: 60px 20px; }
.empty-orders h3 { font-size: 20px; margin: 16px 0 20px; }
.profile-form { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 28px; max-width: 480px; }
@media (max-width: 768px) { .account-layout { grid-template-columns: 1fr; } .account-sidebar { position: static; } }
  `]
})
export class AccountComponent implements OnInit {
  tab         = signal('orders');
  orders      = signal<any[]>([]);
  ordersLoading = signal(true);
  successMsg  = signal('');
  profileName = '';

  constructor(public auth: AuthService, private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.profileName = this.auth.user()?.name || '';
    this.route.queryParams.subscribe(p => {
      if (p['success']) { this.successMsg.set(p['success']); this.tab.set('orders'); }
    });
    this.orderService.getMyOrders().subscribe(res => {
      this.orders.set(res.orders); this.ordersLoading.set(false);
    });
  }
}
