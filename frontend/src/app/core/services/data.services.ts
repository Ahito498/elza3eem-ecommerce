import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = `${environment.apiUrl}/categories`;
  constructor(private http: HttpClient) {}
  getAll()               { return this.http.get<any>(this.api); }
  create(data: any)      { return this.http.post<any>(this.api, data); }
  update(id: string, d: any) { return this.http.put<any>(`${this.api}/${id}`, d); }
  delete(id: string)     { return this.http.delete<any>(`${this.api}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}
  place(data: any)       { return this.http.post<any>(this.api, data); }
  getMyOrders()          { return this.http.get<any>(`${this.api}/my`); }
  getById(id: string)    { return this.http.get<any>(`${this.api}/${id}`); }
  getAll(params?: any)   { return this.http.get<any>(this.api, { params }); }
  getStats()             { return this.http.get<any>(`${this.api}/admin/stats`); }
  updateStatus(id: string, d: any) { return this.http.put<any>(`${this.api}/${id}/status`, d); }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}
  getAll(params?: any)   { return this.http.get<any>(this.api, { params }); }
  getStats()             { return this.http.get<any>(`${this.api}/stats`); }
  update(id: string, d: any) { return this.http.put<any>(`${this.api}/${id}`, d); }
}
