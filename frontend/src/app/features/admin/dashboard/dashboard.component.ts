import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/data.services';
import { UserService } from '../../../core/services/data.services';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="dashboard">
  <div class="dash-header">
    <div>
      <h1>Dashboard</h1>
      <p class="dash-sub">El-Za3eem Admin Panel · Welcome back</p>
    </div>
    <div class="dash-header-actions">
      <a routerLink="/admin/products" class="btn btn-primary btn-sm">+ Add Product</a>
    </div>
  </div>

  <!-- STATS CARDS -->
  @if (stats()) {
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon revenue">💰</div>
        <div class="stat-body">
          <p class="stat-lbl">Total Revenue</p>
          <p class="stat-val">EGP {{ stats()!.totalRevenue | number:'1.0-0' }}</p>
          <p class="stat-note">All time earnings</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orders">📦</div>
        <div class="stat-body">
          <p class="stat-lbl">Total Orders</p>
          <p class="stat-val">{{ stats()!.totalOrders }}</p>
          <p class="stat-note stat-warn">{{ stats()!.pendingOrders }} pending</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon users">👥</div>
        <div class="stat-body">
          <p class="stat-lbl">Total Customers</p>
          <p class="stat-val">{{ userStats()?.totalCustomers || 0 }}</p>
          <p class="stat-note stat-green">+{{ userStats()?.newUsersThisMonth || 0 }} this month</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon products">🛍</div>
        <div class="stat-body">
          <p class="stat-lbl">Active Products</p>
          <p class="stat-val">{{ userStats()?.totalProducts || 0 }}</p>
          <p class="stat-note">In 6 categories</p>
        </div>
      </div>
    </div>

    <!-- ORDER STATUS BREAKDOWN -->
    <div class="dash-grid">
      <div class="dash-card">
        <h3>Order Status Breakdown</h3>
        <div class="status-list">
          @for (s of stats()!.ordersByStatus; track s._id) {
            <div class="status-row">
              <span class="status-dot" [class]="s._id"></span>
              <span class="status-name">{{ s._id | titlecase }}</span>
              <div class="status-bar-wrap">
                <div class="status-bar" [style.width.%]="(s.count / stats()!.totalOrders) * 100" [class]="s._id"></div>
              </div>
              <span class="status-count">{{ s.count }}</span>
            </div>
          }
        </div>
      </div>

      <!-- RECENT ORDERS -->
      <div class="dash-card">
        <div class="card-header">
          <h3>Recent Orders</h3>
          <a routerLink="/admin/orders" class="view-all">View All →</a>
        </div>
        <div class="recent-orders">
          @for (order of stats()!.recentOrders; track order._id) {
            <div class="order-row">
              <div class="order-info">
                <p class="order-num">{{ order.orderNumber }}</p>
                <p class="order-customer">{{ order.user?.name }}</p>
              </div>
              <div class="order-right">
                <span class="order-badge" [class]="order.orderStatus">{{ order.orderStatus }}</span>
                <p class="order-amount">EGP {{ order.totalAmount | number:'1.0-0' }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- QUICK ACTIONS -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <a routerLink="/admin/products" class="action-card">
          <span>🛍</span><p>Manage Products</p>
        </a>
        <a routerLink="/admin/orders" class="action-card">
          <span>📦</span><p>View Orders</p>
        </a>
        <a routerLink="/admin/users" class="action-card">
          <span>👥</span><p>Manage Users</p>
        </a>
        <a routerLink="/products" target="_blank" class="action-card">
          <span>🌐</span><p>View Store</p>
        </a>
      </div>
    </div>
  } @else {
    <div class="spinner"></div>
  }
</div>
  `,
  styles: [`
.dashboard { padding: 32px; max-width: 1200px; }
.dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.dash-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 4px; }
.dash-sub { color: #7a6a52; font-size: 14px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
.stat-card { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 24px; display: flex; gap: 16px; align-items: flex-start; }
.stat-icon { font-size: 28px; width: 52px; height: 52px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.revenue { background: #fdf5e0; }
.stat-icon.orders  { background: #e8f0ff; }
.stat-icon.users   { background: #fde8f0; }
.stat-icon.products { background: #e8fde8; }
.stat-lbl { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #7a6a52; margin-bottom: 4px; }
.stat-val { font-size: 28px; font-weight: 800; color: #1a1008; line-height: 1; margin-bottom: 4px; }
.stat-note { font-size: 12px; color: #9a8a72; }
.stat-warn { color: #d84315; font-weight: 600; }
.stat-green { color: #2e7d32; font-weight: 600; }
.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
.dash-card { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 24px; }
.dash-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.card-header h3 { margin-bottom: 0; }
.view-all { font-size: 13px; color: #8b1a1a; font-weight: 600; text-decoration: none; }
.status-list { display: flex; flex-direction: column; gap: 12px; }
.status-row { display: flex; align-items: center; gap: 10px; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.status-dot.pending    { background: #f59e0b; }
.status-dot.processing { background: #3b82f6; }
.status-dot.shipped    { background: #8b5cf6; }
.status-dot.delivered  { background: #10b981; }
.status-dot.cancelled  { background: #ef4444; }
.status-name { font-size: 13px; width: 80px; text-transform: capitalize; }
.status-bar-wrap { flex: 1; height: 8px; background: #f0e8d8; border-radius: 4px; overflow: hidden; }
.status-bar { height: 100%; border-radius: 4px; transition: width .6s; }
.status-bar.pending    { background: #f59e0b; }
.status-bar.processing { background: #3b82f6; }
.status-bar.shipped    { background: #8b5cf6; }
.status-bar.delivered  { background: #10b981; }
.status-bar.cancelled  { background: #ef4444; }
.status-count { font-size: 13px; font-weight: 700; width: 24px; text-align: right; }
.order-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0e8d8; }
.order-num { font-size: 13px; font-weight: 700; color: #8b1a1a; }
.order-customer { font-size: 12px; color: #9a8a72; }
.order-right { text-align: right; }
.order-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; display: inline-block; text-transform: capitalize; letter-spacing: .04em; }
.order-badge.pending    { background: #fef3cd; color: #8b6914; }
.order-badge.processing { background: #dbeafe; color: #1d4ed8; }
.order-badge.shipped    { background: #ede9fe; color: #6d28d9; }
.order-badge.delivered  { background: #d1fae5; color: #065f46; }
.order-badge.cancelled  { background: #fee2e2; color: #991b1b; }
.order-amount { font-size: 14px; font-weight: 800; color: #1a1008; margin-top: 4px; }
.quick-actions h3 { font-size: 18px; font-weight: 800; margin-bottom: 16px; }
.actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.action-card { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 24px; text-align: center; text-decoration: none; color: var(--ink); transition: all .2s; }
.action-card:hover { border-color: #8b1a1a; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
.action-card span { font-size: 32px; display: block; margin-bottom: 10px; }
.action-card p { font-size: 14px; font-weight: 600; }
@media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .dash-grid { grid-template-columns: 1fr; } .actions-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class DashboardComponent implements OnInit {
  stats     = signal<any>(null);
  userStats = signal<any>(null);

  constructor(private orderService: OrderService, private userService: UserService) {}

  ngOnInit() {
    this.orderService.getStats().subscribe(res => this.stats.set(res.stats));
    this.userService.getStats().subscribe(res => this.userStats.set(res.stats));
  }
}
