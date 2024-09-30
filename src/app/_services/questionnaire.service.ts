import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getQuestionnaires(page: number = 1, perPage: number = 0, filters: any = {}): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    // Append additional filters from the filters object
    Object.keys(filters).forEach((key) => {
      params = params.append(key, filters[key]);
    });

    return this.http.get<any>(this.baseUrl + 'questionnaires', { params });
  }

  addQuestionnaire(model: any) {
    return this.http.post(this.baseUrl + 'questionnaires', model);
  }

  addQuestionnaires(batch: any) {
    return this.http.post(this.baseUrl + 'questionnaires/batch', batch);
  }

  updateQuestionnaire(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/questionnaires/${id}`;
    return this.http.put(url, updatedData);
  }

  deleteQuestionnaire(id: string): Observable<any> {
    const url = `${this.baseUrl}/questionnaires/${id}`;
    return this.http.delete(url);
  }
}
