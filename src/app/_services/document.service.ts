import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getDocuments(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'documents', { params });
  }

  addDocument(model: any) {
    return this.http.post(this.baseUrl + 'documents', model);
  }

  addDocuments(batch: any) {
    return this.http.post(this.baseUrl + 'documents/batch', batch);
  }

  updateDocument(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/documents/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteDocument(id: string): Observable<any> {
    const url = `${this.baseUrl}/documents/${id}`;
    return this.http.delete(url);
  }

}
