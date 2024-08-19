import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() {}

  getUserWithRoles(page: number = 1, perPage: number = 2, filters: any = {}) {
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
}
