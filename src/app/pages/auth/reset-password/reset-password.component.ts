import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DynamicFormComponent } from '../../../_form/dynamic-form/dynamic-form.component';
import { QuestionService } from '../../../_services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { QuestionBase } from '../../../_models/question-base';
import { AuthService } from '../../../_services/auth.service';
import { ToastService } from '../../../_services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  token: string = '';

  constructor(questionService: QuestionService) {
    this.questions$ = questionService.getChangePasswordQuestions();
  }

  ngOnInit(): void {
    const isLoggedIn = this.authService.isAuthenticatedUser();
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.route.paramMap.subscribe((params) => {
        this.token = params.get('token') ?? ''; // Convert string param to number using + operator
        if (!this.token) {
          this.toastService.error('Reset token not found');
          this.router.navigate(['/']);
        }
      });
    }
  }

  handleFormSubmit(event: any) {
    const model = {
      password: event.formData.password,
      token: this.token,
    };
    this.authService.resetPassword(model).subscribe({
      next: (res: any) => {
        console.log(res);
        this.toastService.success('Password changed successfully!');
        this.dynamicFormComponent.resetForm();
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
