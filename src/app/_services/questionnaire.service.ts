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

  getQuestionnaires(
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

  addQuestionnaireDocument(formData: FormData) {
    const url = `${this.baseUrl}/questionnaire-documents`;
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  deleteQuestionnaireDocument(id: string): Observable<any> {
    const url = `${this.baseUrl}/questionnaire-documents/${id}`;
    return this.http.delete(url);
  }

  addQuestionnaireProduct(model: any) {
    return this.http.post(this.baseUrl + 'questionnaire-products', model);
  }

  deleteQuestionnaireProduct(id: string): Observable<any> {
    const url = `${this.baseUrl}/questionnaire-products/${id}`;
    return this.http.delete(url);
  }

  // submissions
  addQuestionnaireSubmission(model: any) {
    return this.http.post(this.baseUrl + 'questionnaires/submit', model);
  }

  getQuestionnaireSubmissions(
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

    return this.http.get<any>(this.baseUrl + 'questionnaire-submissions', {
      params,
    });
  }

  updateQuestionnaireSubmissionStatus(id: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/questionnaire-submissions/update-status/${id}`;
    return this.http.put(url, updatedData);
  }
}
