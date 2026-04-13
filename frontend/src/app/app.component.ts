import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
<!-- NAVBAR -->
<nav class="navbar">
  <div class="nav-container">
    <a routerLink="/" class="brand">
      <span class="brand-ar">الزعيم</span>
      <span class="brand-en">El-Za3eem</span>
    </a>
    <div class="nav-links">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
      <a routerLink="/products" routerLinkActive="active">Shop</a>
      <a routerLink="/products" [queryParams]="{category: bags}" routerLinkActive="active">Bags</a>
      <a routerLink="/products" [queryParams]="{category: trolleys}" routerLinkActive="active">Trolleys</a>
      <a routerLink="/products" [queryParams]="{category: shoes}" routerLinkActive="active">Shoes</a>
    </div>
    <div class="nav-actions">
      @if (auth.isAdmin()) {
        <a routerLink="/admin" class="admin-badge">Admin</a>
      }
      @if (auth.isLoggedIn()) {
        <a routerLink="/account" class="icon-btn" title="My Account">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </a>
        <button class="icon-btn" (click)="auth.logout()" title="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      } @else {
        <a routerLink="/login" class="btn-login">Login</a>
      }
      <a routerLink="/cart" class="cart-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        @if (cart.count() > 0) { <span class="cart-badge">{{ cart.count() }}</span> }
      </a>
    </div>
    <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen">☰</button>
  </div>
  @if (mobileOpen) {
    <div class="mobile-menu">
      <a routerLink="/" (click)="mobileOpen=false">Home</a>
      <a routerLink="/products" (click)="mobileOpen=false">Shop All</a>
      <a routerLink="/cart" (click)="mobileOpen=false">Cart ({{ cart.count() }})</a>
      @if (auth.isLoggedIn()) {
        <a routerLink="/account" (click)="mobileOpen=false">My Account</a>
        <button (click)="auth.logout(); mobileOpen=false">Logout</button>
      } @else {
        <a routerLink="/login" (click)="mobileOpen=false">Login</a>
        <a routerLink="/register" (click)="mobileOpen=false">Register</a>
      }
    </div>
  }
</nav>

<main class="main-content">
  <router-outlet></router-outlet>
</main>

<footer class="footer">
  <div class="footer-container">
    <div class="footer-brand">
      <div class="brand-logo">
        <span class="brand-ar">الزعيم</span>
        <span class="brand-en">El-Za3eem</span>
      </div>
      <p>Egypt's premier destination for luxury bags, trolleys, shoes, and accessories. Quality craftsmanship since 1985.</p>
      <div class="social-links">
        <a href="#" aria-label="Instagram">📷</a>
        <a href="#" aria-label="Facebook">📘</a>
        <a href="#" aria-label="TikTok">🎵</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <a routerLink="/products" [queryParams]="{category: 'Handbags'}">Handbags</a>
      <a routerLink="/products" [queryParams]="{category: 'Trolleys'}">Trolleys</a>
      <a routerLink="/products" [queryParams]="{category: 'Shoes'}">Shoes</a>
      <a routerLink="/products" [queryParams]="{category: 'Backpacks'}">Backpacks</a>
      <a routerLink="/products" [queryParams]="{category: 'Wallets'}">Wallets</a>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <a href="#">Shipping & Returns</a>
      <a href="#">Size Guide</a>
      <a href="#">Care Instructions</a>
      <a href="#">Contact Us</a>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <p>📍 Cairo, Egypt</p>
      <p>📞 +20 100 000 0000</p>
      <p>✉️ info&#64;elza3eem.com</p>
      <p>⏰ Sat–Thu: 10am–10pm</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 El-Za3eem. All rights reserved. Made with ❤️ in Egypt.</p>
  </div>
</footer>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }

    .navbar {
      position: sticky; top: 0; z-index: 1000;
      background: #fff; border-bottom: 1px solid #e8e0d8;
      box-shadow: 0 2px 12px rgba(0,0,0,.06);
    }
    .nav-container {
      max-width: 1280px; margin: 0 auto; padding: 0 24px;
      display: flex; align-items: center; gap: 32px; height: 68px;
    }
    .brand { display: flex; flex-direction: column; text-decoration: none; line-height: 1; }
    .brand-ar { font-size: 18px; font-weight: 800; color: #8b1a1a; font-family: 'Cairo', sans-serif; }
    .brand-en { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #8b6914; }
    .brand-logo { display: flex; flex-direction: column; line-height: 1; margin-bottom: 12px; }

    .nav-links { display: flex; gap: 24px; flex: 1; }
    .nav-links a { text-decoration: none; font-size: 14px; font-weight: 500; color: #555; transition: color .2s; padding: 4px 0; border-bottom: 2px solid transparent; }
    .nav-links a:hover, .nav-links a.active { color: #8b1a1a; border-bottom-color: #8b1a1a; }

    .nav-actions { display: flex; align-items: center; gap: 12px; }
    .icon-btn { background: none; border: none; cursor: pointer; color: #444; padding: 6px; display: flex; transition: color .2s; }
    .icon-btn:hover { color: #8b1a1a; }
    .btn-login { text-decoration: none; font-size: 13px; font-weight: 600; color: #8b1a1a; padding: 7px 16px; border: 1.5px solid #8b1a1a; border-radius: 4px; transition: all .2s; }
    .btn-login:hover { background: #8b1a1a; color: #fff; }
    .admin-badge { background: #8b1a1a; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-decoration: none; letter-spacing: .04em; }
    .cart-btn { position: relative; display: flex; align-items: center; color: #444; padding: 6px; text-decoration: none; transition: color .2s; }
    .cart-btn:hover { color: #8b1a1a; }
    .cart-badge { position: absolute; top: -2px; right: -4px; background: #8b1a1a; color: #fff; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

    .mobile-menu-btn { display: none; background: none; border: none; font-size: 22px; cursor: pointer; margin-left: auto; }
    .mobile-menu { background: #fff; border-top: 1px solid #eee; padding: 16px 24px; display: flex; flex-direction: column; gap: 12px; }
    .mobile-menu a, .mobile-menu button { text-decoration: none; font-size: 15px; color: #333; background: none; border: none; cursor: pointer; text-align: left; }

    .main-content { flex: 1; }

    .footer { background: #1a1008; color: #c8b89a; padding: 60px 0 0; margin-top: 80px; }
    .footer-container { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
    .footer-brand p { font-size: 13px; line-height: 1.7; color: #9a8a72; margin-bottom: 16px; }
    .social-links { display: flex; gap: 12px; font-size: 20px; }
    .social-links a { text-decoration: none; }
    .footer-col h4 { color: #e8d8c0; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 16px; }
    .footer-col a { display: block; color: #9a8a72; text-decoration: none; font-size: 13px; margin-bottom: 8px; transition: color .2s; }
    .footer-col a:hover { color: #e8d8c0; }
    .footer-col p { font-size: 13px; color: #9a8a72; margin-bottom: 6px; }
    .footer-bottom { border-top: 1px solid #2a2010; margin-top: 48px; padding: 20px 24px; text-align: center; font-size: 12px; color: #6a5a42; }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .mobile-menu-btn { display: block; }
      .footer-container { grid-template-columns: 1fr; gap: 32px; }
      .nav-actions .btn-login { display: none; }
    }
  `]
})
export class AppComponent {
  mobileOpen = false;
  bags = 'Handbags'; trolleys = 'Trolleys'; shoes = 'Shoes';
  constructor(public auth: AuthService, public cart: CartService) {}
}
