import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string; name: string; email: string; role: 'customer' | 'admin'; avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('ez_token'));

  readonly user   = this._user.asReadonly();
  readonly token  = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly isAdmin    = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    if (this._token()) this.loadProfile();
  }

  register(data: { name: string; email: string; password: string }) {
    return this.http.post<any>(`${this.api}/auth/register`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.api}/auth/login`, { email, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  loadProfile() {
    return this.http.get<any>(`${this.api}/auth/me`).pipe(
      tap(res => this._user.set(res.user))
    ).subscribe({ error: () => this.logout() });
  }

  logout() {
    localStorage.removeItem('ez_token');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null { return this._token(); }

  private setSession(res: any) {
    localStorage.setItem('ez_token', res.token);
    this._token.set(res.token);
    this._user.set(res.user);
  }
}
