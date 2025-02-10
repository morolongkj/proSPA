import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getNotifications(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'notifications', { params });
  }

  getNotification(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/notifications/${id}`);
  }

  addNotification(model: any) {
    return this.http.post(this.baseUrl + 'notifications', model);
  }

  addNotifications(batch: any) {
    return this.http.post(this.baseUrl + 'notifications/batch', batch);
  }

  updateNotification(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/notifications/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteNotification(id: string): Observable<any> {
    const url = `${this.baseUrl}/notifications/${id}`;
    return this.http.delete(url);
  }
}
