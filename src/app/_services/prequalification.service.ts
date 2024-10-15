import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrequalificationService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getPrequalifications(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'prequalifications', { params });
  }

  addPrequalification(model: any) {
    return this.http.post(this.baseUrl + 'prequalifications', model);
  }

  addPrequalifications(batch: any) {
    return this.http.post(this.baseUrl + 'prequalifications/batch', batch);
  }

  updatePrequalification(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/prequalifications/${id}`;
    return this.http.put(url, updatedData);
  }

  deletePrequalification(id: string): Observable<any> {
    const url = `${this.baseUrl}/prequalifications/${id}`;
    return this.http.delete(url);
  }

  uploadImage(formData: FormData) {
    const url = `${this.baseUrl}/prequalifications/upload-image`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  addPrequalificationProduct(model: any) {
    return this.http.post(this.baseUrl + 'prequalification-products', model);
  }
  deletePrequalificationProduct(id: string): Observable<any> {
    const url = `${this.baseUrl}/prequalification-products/${id}`;
    return this.http.delete(url);
  }

  addPrequalificationAttachment(formData: FormData) {
    const url = `${this.baseUrl}/prequalification-attachments`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  deletePrequalificationAttachment(id: string): Observable<any> {
    const url = `${this.baseUrl}/prequalification-attachments/${id}`;
    return this.http.delete(url);
  }

  getPrequalificationStatusList(
    page: number = 1,
    perPage: number = 0,
    filters: any = {}
  ): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'prequalification-status', { params });
  }

  addPrequalificationApproval(model: any) {
    return this.http.post(this.baseUrl + 'prequalification-approvals', model);
  }
}
