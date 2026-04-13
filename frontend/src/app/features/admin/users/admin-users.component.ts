import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/data.services';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="admin-page">
  <div class="admin-page-header">
    <div><h1>Users</h1><p>{{ total() }} registered users</p></div>
  </div>
  @if (loading()) { <div class="spinner"></div> }
  @else {
    <div class="table-wrap">
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          @for (user of users(); track user._id) {
            <tr>
              <td><div class="user-cell"><div class="user-av">{{ user.name[0] }}</div><span>{{ user.name }}</span></div></td>
              <td style="color:#7a6a52;font-size:13px">{{ user.email }}</td>
              <td><span class="role-badge" [class.admin]="user.role==='admin'">{{ user.role }}</span></td>
              <td style="font-size:12px;color:#9a8a72">{{ user.createdAt | date:'MMM d, y' }}</td>
              <td><span [style.color]="user.isActive ? '#2e7d32' : '#c62828'" style="font-weight:600;font-size:13px">{{ user.isActive ? 'Active' : 'Deactivated' }}</span></td>
              <td>
                <select class="form-control" style="width:120px;font-size:12px;padding:5px 8px" [(ngModel)]="user.role" (change)="updateRole(user)">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
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
.admin-page { padding: 32px; max-width: 1100px; }
.admin-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
.admin-page-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
.admin-page-header p { color: #7a6a52; font-size: 14px; }
.table-wrap { background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { background: #f5f0e8; padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #7a6a52; }
.admin-table td { padding: 14px 16px; border-top: 1px solid #f0e8d8; font-size: 14px; vertical-align: middle; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.user-av { width: 36px; height: 36px; background: #8b1a1a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.role-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: #f5f0e8; color: #5a4a32; text-transform: capitalize; }
.role-badge.admin { background: #fde8e8; color: #8b1a1a; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users   = signal<any[]>([]);
  loading = signal(true);
  total   = signal(0);
  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.getAll({ limit: 100 }).subscribe(res => {
      this.users.set(res.users); this.total.set(res.total); this.loading.set(false);
    });
  }
  updateRole(user: any) { this.userService.update(user._id, { role: user.role }).subscribe(); }
}
