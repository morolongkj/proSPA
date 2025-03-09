import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getProducts(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'products', { params });
  }

  addProduct(model: any) {
    return this.http.post(this.baseUrl + 'products', model);
  }

  addProducts(batch: any) {
    return this.http.post(this.baseUrl + 'products/batch', batch);
  }

  updateProduct(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/products/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.baseUrl}/products/${id}`;
    return this.http.delete(url);
  }

  uploadImage(formData: FormData) {
    const url = `${this.baseUrl}/products/upload-image`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
