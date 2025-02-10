import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * Generic HTTP request method.
   * @param method HTTP method (GET, POST, PUT, DELETE, PATCH)
   * @param endpoint API endpoint (e.g., '/users', '/products')
   * @param options Optional object for headers, params, and body
   * @returns Observable of the HTTP response
   */
  request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?:
        | HttpParams
        | {
            [param: string]:
              | string
              | number
              | boolean
              | ReadonlyArray<string | number | boolean>;
          };
      body?: any;
    } = {}
  ): Observable<T> {
    const url = this.getBaseUrl() + endpoint;

    return this.http.request<T>(method, url, {
      headers: options.headers,
      params: options.params,
      body: options.body,
    });
  }

  /**
   * Shortcut for GET requests.
   * @param endpoint API endpoint
   * @param params Optional query parameters
   * @returns Observable of the HTTP response
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.request<T>('GET', endpoint, { params });
  }

  /**
   * Shortcut for POST requests.
   * @param endpoint API endpoint
   * @param body Request body
   * @param headers Optional headers
   * @returns Observable of the HTTP response
   */
  post<T>(endpoint: string, body: any, headers?: any): Observable<T> {
    return this.request<T>('POST', endpoint, { body, headers });
  }

  /**
   * Shortcut for PUT requests.
   * @param endpoint API endpoint
   * @param body Request body
   * @returns Observable of the HTTP response
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.request<T>('PUT', endpoint, { body });
  }

  /**
   * Shortcut for DELETE requests.
   * @param endpoint API endpoint
   * @param params Optional query parameters
   * @returns Observable of the HTTP response
   */
  delete<T>(endpoint: string, params?: any): Observable<T> {
    return this.request<T>('DELETE', endpoint, { params });
  }

  /**
   * Get the base URL for the API.
   * Modify this method to dynamically fetch the base URL if needed.
   * @returns Base URL as a string
   */
  private getBaseUrl(): string {
    return environment.apiUrl; // Replace with your base URL
  }
}
