import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../_models/question-base';
import { QuestionService } from '../../../_services/question.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../_services/auth.service';
import { ToastService } from '../../../_services/toast.service';
import AOS from 'aos';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [QuestionService],
  imports: [RouterLink, AsyncPipe, DynamicFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  constructor(questionService: QuestionService) {
    this.questions$ = questionService.getLoginQuestions();
  }

  ngOnInit(): void {
    AOS.init();
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
    this.authService.login(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          // login successful
          this.toastService.success('Logged in successfully!');
          this.dynamicFormComponent.resetForm();
        } else {
          this.toastService.error('Wrong username and/or password');
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
