import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters: any = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, String(v)); });
    return this.http.get<any>(this.api, { params });
  }

  getFeatured()          { return this.http.get<any>(`${this.api}/featured`); }
  getById(id: string)    { return this.http.get<any>(`${this.api}/${id}`); }
  create(data: any)      { return this.http.post<any>(this.api, data); }
  update(id: string, d: any) { return this.http.put<any>(`${this.api}/${id}`, d); }
  delete(id: string)     { return this.http.delete<any>(`${this.api}/${id}`); }
  addReview(id: string, d: any) { return this.http.post<any>(`${this.api}/${id}/reviews`, d); }
}
