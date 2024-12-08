import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getUserWithRoles(page: number = 1, perPage: number = 10, filters: any = {}) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    console.log(params);

    return this.http.get<any>(this.baseUrl + 'users', { params });
  }

  addUser(user: any) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  updateUser(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}users/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteUser(id: string): Observable<any> {
    const url = `${this.baseUrl}users/${id}`;
    return this.http.delete(url);
  }

  banUser(id: Number) {
    return this.http.post(this.baseUrl + 'users/ban/' + id, {});
  }

  unBanUser(id: Number) {
    return this.http.post(this.baseUrl + 'users/unban/' + id, {});
  }

  updateUserRoles(action: string, model: any, id: Number) {
    return this.http.post<any>(
      this.baseUrl + 'users/' + action + '/' + id,
      model
    );
  }

  getUsersCount() {
    return this.http.get<any>(this.baseUrl + 'users/count');
  }

  changePassword(model: any, id: Number) {
    return this.http.post<any>(
      this.baseUrl + 'users/change-password/' + id,
      model
    );
  }
}
