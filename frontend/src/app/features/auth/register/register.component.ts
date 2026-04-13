import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
<div class="auth-page">
  <div class="auth-card">
    <div class="auth-brand">
      <span class="brand-ar">الزعيم</span>
      <span class="brand-en">El-Za3eem</span>
    </div>
    <h2>Create Account</h2>
    <p class="auth-sub">Join El-Za3eem and enjoy exclusive member benefits</p>

    @if (error()) { <div class="alert alert-error">{{ error() }}</div> }

    <div class="form-group">
      <label class="form-label">Full Name</label>
      <input class="form-control" type="text" placeholder="Your full name" [(ngModel)]="name"/>
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-control" type="email" placeholder="you@example.com" [(ngModel)]="email"/>
    </div>
    <div class="form-group">
      <label class="form-label">Password</label>
      <input class="form-control" type="password" placeholder="Min. 6 characters" [(ngModel)]="password"/>
    </div>
    <button class="btn btn-primary btn-block btn-lg" (click)="register()" [disabled]="loading()">
      {{ loading() ? 'Creating account...' : 'Create Account' }}
    </button>
    <p class="auth-switch">Already have an account? <a routerLink="/login">Sign In</a></p>
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
.auth-switch { text-align: center; font-size: 14px; color: #7a6a52; margin-top: 20px; }
.auth-switch a { color: #8b1a1a; font-weight: 600; text-decoration: none; }
  `]
})
export class RegisterComponent {
  name = ''; email = ''; password = '';
  loading = signal(false); error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.password) { this.error.set('Please fill in all fields'); return; }
    this.loading.set(true); this.error.set('');
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => { this.error.set(err.error?.message || 'Registration failed'); this.loading.set(false); }
    });
  }
}
