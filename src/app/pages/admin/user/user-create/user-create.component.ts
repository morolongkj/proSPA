import { Component, inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
import { UserService } from '../../../../_services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent, RouterLink],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  constructor(service: QuestionService) {
    this.questions$ = service.getRegistrationQuestions();
  }

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      username: event.formData.emailAddress,
      email: event.formData.emailAddress,
      first_name: event.formData.firstName,
      last_name: event.formData.lastName,
      password: event.formData.password,
    };
    this.userService.addUser(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('User is created successfully!');
          this.dynamicFormComponent.resetForm();
        } else {
          this.toastService.error('Unknown error occured');
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
