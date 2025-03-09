import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../_models/question-base';
import { AuthService } from '../../../_services/auth.service';
import { QuestionService } from '../../../_services/question.service';
import { ToastService } from '../../../_services/toast.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  constructor(questionService: QuestionService) {
    this.questions$ = questionService.getForgotPasswordQuestions();
  }

  ngOnInit(): void {
    const isLoggedIn = this.authService.isAuthenticatedUser();
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  handleFormSubmit(event: any) {
    const model = {
      email: event.formData.emailAddress,
      password: event.formData.password,
    };
    this.authService.requestResetPassword(model).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toastService.success(res.message || 'Successful');
        this.dynamicFormComponent.resetForm();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
