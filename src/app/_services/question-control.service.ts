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

  // Additional validators for other field types (min, max, length)
  minMaxValidator(minValue?: number, maxValue?: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (minValue !== undefined && value < minValue) {
        return { minError: true };
      }
      if (maxValue !== undefined && value > maxValue) {
        return { maxError: true };
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

      // Add min/max validators if applicable
      if (question.min !== undefined || question.max !== undefined) {
        validators.push(this.minMaxValidator(question.min, question.max));
      }

      if (question.type === 'text' && question.maxLength) {
        validators.push(Validators.maxLength(question.maxLength));
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
