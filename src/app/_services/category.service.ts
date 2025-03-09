import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getCategories(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'categories', { params });
  }

  addCategory(model: any) {
    return this.http.post(this.baseUrl + 'categories', model);
  }

  addCategories(batch: any) {
    return this.http.post(this.baseUrl + 'categories/batch', batch);
  }

  updateCategory(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/categories/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteCategory(id: string): Observable<any> {
    const url = `${this.baseUrl}/categories/${id}`;
    return this.http.delete(url);
  }

}
