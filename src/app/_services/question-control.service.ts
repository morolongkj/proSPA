import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { QuestionBase } from '../_models/question-base';

@Injectable()
export class QuestionControlService {
  confirmPasswordValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.root.get(controlName);
      if (passwordControl && control.value !== passwordControl.value) {
        return { mismatch: true };
      }
      return null;
    };
  }

  toFormGroup(questions: QuestionBase<string>[]) {
    const group: any = {};
    questions.forEach((question) => {
      const validators: any[] = [];

      if (question.required) {
        validators.push(Validators.required);
      }

      if (question.type === 'email') {
        validators.push(Validators.email);
      }

      if (question.key === 'confirmPassword') {
        validators.push(this.confirmPasswordValidator('password')); // Assuming 'password' is the key for the password field
      }

      group[question.key] = new FormControl(question.value || '', validators);
    });
    return new FormGroup(group);
    // const group: any = {};
    // questions.forEach((question) => {
    //   group[question.key] = question.required
    //     ? new FormControl(question.value || '', Validators.required)
    //     : new FormControl(question.value || '');
    // });
    // return new FormGroup(group);
  }
}
