import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionService } from '../../../../_services/question.service';
import { Observable } from 'rxjs';
import { QuestionBase } from '../../../../_models/question-base';
import { AuthService } from '../../../../_services/auth.service';
import { ToastService } from '../../../../_services/toast.service';

@Component({
  selector: 'app-pre-qualification-create',
  standalone: true,
  providers: [QuestionService],
  imports: [RouterLink, AsyncPipe, DynamicFormComponent],
  templateUrl: './pre-qualification-create.component.html',
  styleUrl: './pre-qualification-create.component.css',
})
export class PreQualificationCreateComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;

  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  constructor(service: QuestionService) {
    this.questions$ = service.getPrequalificationQuestions();
  }

  ngOnInit(): void {}

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
  }
}
