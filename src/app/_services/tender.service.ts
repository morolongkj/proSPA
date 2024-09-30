import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TenderService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getTenders(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'tenders', { params });
  }

  addTender(model: any) {
    return this.http.post(this.baseUrl + 'tenders', model);
  }

  addTenders(batch: any) {
    return this.http.post(this.baseUrl + 'tenders/batch', batch);
  }

  updateTender(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/tenders/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteTender(id: string): Observable<any> {
    const url = `${this.baseUrl}/tenders/${id}`;
    return this.http.delete(url);
  }

  uploadImage(formData: FormData) {
    const url = `${this.baseUrl}/tenders/upload-image`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  addTenderProduct(model: any) {
    return this.http.post(this.baseUrl + 'tender-products', model);
  }
  deleteTenderProduct(id: string): Observable<any> {
    const url = `${this.baseUrl}/tender-products/${id}`;
    return this.http.delete(url);
  }

  addTenderAttachment(formData: FormData) {
    const url = `${this.baseUrl}/tender-attachments`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  deleteTenderAttachment(id: string): Observable<any> {
    const url = `${this.baseUrl}/tender-attachments/${id}`;
    return this.http.delete(url);
  }

  getTenderStatusList(
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

    return this.http.get<any>(this.baseUrl + 'tender-status', { params });
  }

  addTenderApproval(model: any) {
    return this.http.post(this.baseUrl + 'tender-approvals', model);
  }
}
