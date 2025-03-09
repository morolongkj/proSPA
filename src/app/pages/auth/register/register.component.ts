import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DynamicFormComponent } from '../../../_form/dynamic-form/dynamic-form.component';
import { QuestionService } from '../../../_services/question.service';
import { Observable } from 'rxjs';
import { QuestionBase } from '../../../_models/question-base';
import { AuthService } from '../../../_services/auth.service';
import { ToastService } from '../../../_services/toast.service';
import { Router, RouterLink } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-register',
  standalone: true,
  providers: [QuestionService],
  imports: [RouterLink, AsyncPipe, DynamicFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;

  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  constructor(service: QuestionService) {
    this.questions$ = service.getRegistrationQuestions();
  }

  ngOnInit(): void {
    AOS.init();
    const isLoggedIn = this.authService.isAuthenticatedUser();
    if (isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      first_name: event.formData.firstName,
      last_name: event.formData.lastName,
      email: event.formData.emailAddress,
      username: event.formData.emailAddress,
      password: event.formData.password,
    };
    if (event.formData.password === event.formData.confirmPassword) {
      this.authService.register(model).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.status) {
            this.dynamicFormComponent.resetForm();
            this.toastService.success(
              'Registration is successful',
              'Account Created'
            );
            this.authService.login(model).subscribe({});
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    } else {
      this.toastService.error('Passwords does not match', 'Cannot Submit');
    }
  }
}
