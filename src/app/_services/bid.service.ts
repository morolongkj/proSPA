import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getBids(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'bids', { params });
  }

  getBid(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/bids/${id}`);
  }

  addBid(model: any) {
    return this.http.post(this.baseUrl + 'bids', model);
  }

  addBids(batch: any) {
    return this.http.post(this.baseUrl + 'bids/batch', batch);
  }

  updateBid(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/bids/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteBid(id: string): Observable<any> {
    const url = `${this.baseUrl}/bids/${id}`;
    return this.http.delete(url);
  }
}
