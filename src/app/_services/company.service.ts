import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getCompanies(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'companies', { params });
  }

  getCompany(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/companies/${id}`);
  }

  addCompany(model: any) {
    return this.http.post(this.baseUrl + 'companies', model);
  }

  addCompanies(batch: any) {
    return this.http.post(this.baseUrl + 'companies/batch', batch);
  }

  updateCompany(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/companies/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteCompany(id: string): Observable<any> {
    const url = `${this.baseUrl}/companies/${id}`;
    return this.http.delete(url);
  }
}
