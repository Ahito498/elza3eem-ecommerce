import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
<div class="auth-page">
  <div class="auth-card">
    <div class="auth-brand">
      <span class="brand-ar">الزعيم</span>
      <span class="brand-en">El-Za3eem</span>
    </div>
    <h2>Welcome Back</h2>
    <p class="auth-sub">Sign in to your El-Za3eem account</p>

    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-control" type="email" placeholder="you@example.com" [(ngModel)]="email"/>
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input class="form-control" type="password" placeholder="••••••••" [(ngModel)]="password"/>
    </div>
    <button class="btn btn-primary btn-block btn-lg" (click)="login()" [disabled]="loading()">
      {{ loading() ? 'Signing in...' : 'Sign In' }}
    </button>

    <div class="auth-demo">
      <p>Demo credentials:</p>
      <code>admin&#64;elza3eem.com / admin123</code><br>
      <code>sara&#64;example.com / customer123</code>
    </div>

    <p class="auth-switch">Don't have an account? <a routerLink="/register">Register</a></p>
  </div>
</div>
  `,
  styles: [`
.auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #faf8f4; padding: 40px 20px; }
.auth-card { background: #fff; border: 1px solid #e8e0d0; border-radius: 12px; padding: 48px; width: 100%; max-width: 440px; }
.auth-brand { display: flex; flex-direction: column; align-items: center; margin-bottom: 28px; }
.brand-ar { font-size: 28px; font-weight: 800; color: #8b1a1a; }
.brand-en { font-size: 12px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #8b6914; }
.auth-card h2 { font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 6px; }
.auth-sub { text-align: center; color: #7a6a52; font-size: 14px; margin-bottom: 28px; }
.auth-demo { background: #faf5ec; border: 1px solid #e8d8b0; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 12px; }
.auth-demo p { font-weight: 600; color: #5a4020; margin-bottom: 6px; }
.auth-demo code { display: block; color: #8b1a1a; margin: 3px 0; }
.auth-switch { text-align: center; font-size: 14px; color: #7a6a52; margin-top: 20px; }
.auth-switch a { color: #8b1a1a; font-weight: 600; text-decoration: none; }
  `]
})
export class LoginComponent {
  email = ''; password = '';
  loading = signal(false);
  error   = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) { this.error.set('Please fill in all fields'); return; }
    this.loading.set(true); this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate([this.auth.isAdmin() ? '/admin' : '/']),
      error: (err) => { this.error.set(err.error?.message || 'Login failed'); this.loading.set(false); }
    });
  }
}
