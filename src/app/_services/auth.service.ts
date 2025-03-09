import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  isAuthenticated = false;
  private userRoles: string[] = ['admin'];
  private userFilters: string[] = [];
  private userId: number = 0;
  decodedToken: any;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);

  constructor() {}

  register(user: any) {
    return this.http.post(this.apiUrl + 'register', user);
  }

  login(model: any) {
    return this.http.post(this.apiUrl + 'signin', model).pipe(
      map((res: any) => {
        const data = res.data;
        if (data.token) {
          this.isAuthenticated = true;
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('roles', JSON.stringify(data.roles));
          localStorage.setItem('user', JSON.stringify(data.user));
          // this.router.navigate(['/']);
          window.location.reload();
        }
      })
    );
  }

  requestResetPassword(model: any) {
    return this.http.post(this.apiUrl + 'request-reset-password', model);
  }

  resetPassword(model: any) {
    return this.http.post(this.apiUrl + 'reset-password', model);
  }

  logout() {
    this.isAuthenticated = false;
    // remove user from local storage to log user out
    localStorage.removeItem('authToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('user');
    window.location.reload();
  }

  getToken() {
    return this.isAuthenticatedUser() ? localStorage.getItem('authToken') : '';
  }

  isAuthenticatedUser(): boolean {
    const token = localStorage.getItem('authToken');
    this.isAuthenticated = !this.jwtHelper.isTokenExpired(token);
    return this.isAuthenticated;
  }

  getUserRoles(): string[] {
    if (localStorage.getItem('roles')) {
      this.userRoles = JSON.parse(localStorage.getItem('roles') ?? '');
      // console.log(this.userRoles);
    }
    return this.userRoles;
  }

  getUserId(): number {
    const token = localStorage.getItem('authToken') as string;
    this.decodedToken = this.jwtHelper.decodeToken(token);
    this.userId = this.decodedToken?.sub;
    console.log(this.userId);
    return +this.userId || 0;
  }

  getUser(): any {
    const id = this.getUserId();
    return this.http.get<any>(this.apiUrl + 'profile/' + id);
  }

  getCurrentUser() {
    // const id = this.getUserId();
    return JSON.parse(localStorage.getItem('user') ?? '');
  }

  roleMatch(allowedRoles: any): boolean {
    let isMatch = false;
    const userRoles = this.getUserRoles();
    allowedRoles.forEach((element: string) => {
      if (userRoles?.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch && this.isAuthenticatedUser();
  }


  getCompanyId(): string | null {
    let user: any = null;

    // Check if the 'user' key exists in localStorage
    if (localStorage.getItem('user')) {
      // Parse the user object from localStorage
      user = JSON.parse(localStorage.getItem('user') ?? '');
    }

    // Return the company_id if it exists in the user object, otherwise return null
    return user?.company_id ?? null;
  }
}
