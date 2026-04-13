import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/data.services';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="admin-page">
  <div class="admin-page-header">
    <div><h1>Orders</h1><p>{{ total() }} orders total</p></div>
    <select class="form-control" style="width:180px" [(ngModel)]="statusFilter" (change)="load()">
      <option value="">All Orders</option>
      <option value="pending">Pending</option>
      <option value="processing">Processing</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>

  @if (loading()) { <div class="spinner"></div> }
  @else {
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Order Status</th><th>Payment</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for (order of orders(); track order._id) {
            <tr>
              <td><strong class="order-num">{{ order.orderNumber }}</strong></td>
              <td>
                <p style="font-weight:600;font-size:13px">{{ order.user?.name }}</p>
                <p style="font-size:11px;color:#9a8a72">{{ order.user?.email }}</p>
              </td>
              <td>{{ order.items?.length }} item(s)</td>
              <td style="font-weight:700;color:#8b1a1a">EGP {{ order.totalAmount | number:'1.0-0' }}</td>
              <td>
                <select class="status-select" [class]="order.orderStatus" [(ngModel)]="order.orderStatus" (change)="updateStatus(order, 'orderStatus', order.orderStatus)">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <span class="payment-badge" [class]="order.paymentStatus">{{ order.paymentStatus }}</span>
              </td>
              <td style="font-size:12px;color:#9a8a72">{{ order.createdAt | date:'MMM d, y' }}</td>
              <td>
                <button class="btn btn-outline btn-sm" (click)="viewOrder(order)">Details</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }

  @if (selectedOrder()) {
    <div class="modal-overlay" (click)="selectedOrder.set(null)">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Order {{ selectedOrder()!.orderNumber }}</h3>
          <button class="modal-close" (click)="selectedOrder.set(null)">✕</button>
        </div>
        <div class="modal-body">
          <div class="order-detail-grid">
            <div>
              <h4>Customer</h4>
              <p>{{ selectedOrder()!.user?.name }}</p>
              <p style="color:#9a8a72">{{ selectedOrder()!.user?.email }}</p>
            </div>
            <div>
              <h4>Shipping Address</h4>
              <p>{{ selectedOrder()!.shippingAddress?.fullName }}</p>
              <p style="color:#9a8a72">{{ selectedOrder()!.shippingAddress?.street }}, {{ selectedOrder()!.shippingAddress?.city }}, {{ selectedOrder()!.shippingAddress?.country }}</p>
            </div>
          </div>
          <h4 style="margin:20px 0 12px">Items</h4>
          @for (item of selectedOrder()!.items; track item.product) {
            <div class="order-item-row">
              <span>{{ item.name }}</span>
              <span>× {{ item.quantity }}</span>
              <span>EGP {{ item.price | number }}</span>
              <span style="font-weight:700">EGP {{ (item.price * item.quantity) | number }}</span>
            </div>
          }
          <div class="order-totals">
            <div class="sum-row"><span>Subtotal</span><span>EGP {{ selectedOrder()!.subtotal | number }}</span></div>
            <div class="sum-row"><span>Shipping</span><span>EGP {{ selectedOrder()!.shippingCost | number }}</span></div>
            <div class="sum-row" style="font-weight:800"><span>Total</span><span>EGP {{ selectedOrder()!.totalAmount | number }}</span></div>
          </div>
        </div>
      </div>
    </div>
  }
</div>
  `,
  styles: [`
.admin-page { padding: 32px; max-width: 1200px; }
.admin-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.admin-page-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
.admin-page-header p { color: #7a6a52; font-size: 14px; }
.table-wrap { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; overflow: auto; }
.admin-table { width: 100%; border-collapse: collapse; min-width: 800px; }
.admin-table th { background: #f5f0e8; padding: 12px 14px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #7a6a52; }
.admin-table td { padding: 12px 14px; border-top: 1px solid #f0e8d8; font-size: 14px; vertical-align: middle; }
.order-num { color: #8b1a1a; font-size: 13px; }
.status-select { border: 1.5px solid #e8e0d0; border-radius: 6px; padding: 5px 10px; font-size: 12px; font-weight: 600; cursor: pointer; }
.status-select.pending    { background: #fef3cd; color: #8b6914; border-color: #f59e0b; }
.status-select.processing { background: #dbeafe; color: #1d4ed8; border-color: #3b82f6; }
.status-select.shipped    { background: #ede9fe; color: #6d28d9; border-color: #8b5cf6; }
.status-select.delivered  { background: #d1fae5; color: #065f46; border-color: #10b981; }
.status-select.cancelled  { background: #fee2e2; color: #991b1b; border-color: #ef4444; }
.payment-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; text-transform: capitalize; }
.payment-badge.pending { background: #fef3cd; color: #8b6914; }
.payment-badge.paid    { background: #d1fae5; color: #065f46; }
.payment-badge.failed  { background: #fee2e2; color: #991b1b; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: #fff; border-radius: 12px; width: 100%; max-width: 580px; max-height: 80vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; border-bottom: 1px solid #e8e0d0; }
.modal-header h3 { font-size: 18px; font-weight: 800; }
.modal-close { background: none; border: none; font-size: 20px; cursor: pointer; }
.modal-body { padding: 24px 28px; }
.modal-body h4 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #7a6a52; margin-bottom: 6px; }
.order-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 8px; }
.order-item-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 8px; padding: 10px 0; border-bottom: 1px solid #f0e8d8; font-size: 14px; }
.order-totals { margin-top: 16px; }
.sum-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders        = signal<any[]>([]);
  loading       = signal(true);
  total         = signal(0);
  statusFilter  = '';
  selectedOrder = signal<any>(null);

  constructor(private orderService: OrderService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const params: any = { limit: 50 };
    if (this.statusFilter) params.status = this.statusFilter;
    this.orderService.getAll(params).subscribe(res => {
      this.orders.set(res.orders);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  updateStatus(order: any, field: string, value: string) {
    this.orderService.updateStatus(order._id, { [field]: value }).subscribe();
  }

  viewOrder(order: any) { this.selectedOrder.set(order); }
}
