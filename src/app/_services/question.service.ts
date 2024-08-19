import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { QuestionBase } from '../_models/question-base';
import { DropdownQuestion } from '../_models/question-dropdown';
import { TextboxQuestion } from '../_models/question-textbox';
import { TextareaQuestion } from '../_models/question-textarea';
import { RadioQuestion } from '../_models/question-radio';
import { CheckboxQuestion } from '../_models/question-checkbox';
@Injectable()
export class QuestionService {
  // TODO: get from a remote source of question metadata
  getQuestions() {
    const questions: QuestionBase<string>[] = [
      new DropdownQuestion({
        key: 'favoriteAnimal',
        label: 'Favorite Animal',
        options: [
          { key: 'cat', value: 'Cat' },
          { key: 'dog', value: 'Dog' },
          { key: 'horse', value: 'Horse' },
          { key: 'capybara', value: 'Capybara' },
        ],
        order: 3,
      }),
      new TextboxQuestion({
        key: 'firstName',
        label: 'First Name',
        value: 'Alex',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getRegistrationQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'companyName',
        label: 'Company Name',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        required: true,
        order: 3,
      }),
      new TextboxQuestion({
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        order: 4,
      }),
      new TextboxQuestion({
        key: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        required: true,
        order: 5,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getLoginQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        order: 2,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getCategoryQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'categoryTitle',
        label: 'Category Title',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'categoryDisplayOrder',
        label: 'Category Display Order',
        value: '0',
        type: 'number',
        required: true,
        order: 2,
      }),
      new TextareaQuestion({
        key: 'categoryDescription',
        label: 'Category Description',
        type: 'textarea',
        richText: true,
        required: true,
        order: 3,
      }),
      // new DropdownQuestion({
      //   key: 'favoriteAnimal',
      //   label: 'Favorite Animal',
      //   options: [
      //     { key: 'cat', value: 'Cat' },
      //     { key: 'dog', value: 'Dog' },
      //     { key: 'horse', value: 'Horse' },
      //     { key: 'capybara', value: 'Capybara' },
      //   ],
      //   order: 4,
      // }),
      // new RadioQuestion({
      //   key: 'radioTest',
      //   label: 'Radio Test',
      //   type: 'radio',
      //   options: [
      //     { key: 'cat', value: 'Cat' },
      //     { key: 'dog', value: 'Dog' },
      //     { key: 'horse', value: 'Horse' },
      //     { key: 'capybara', value: 'Capybara' },
      //   ],
      //   order: 5,
      // }),
      // new CheckboxQuestion({
      //   key: 'checkTest',
      //   label: 'Check Test',
      //   type: 'checkbox',
      //   options: [
      //     { key: 'cat', value: 'Cat' },
      //     { key: 'dog', value: 'Dog' },
      //     { key: 'horse', value: 'Horse' },
      //     { key: 'capybara', value: 'Capybara' },
      //   ],
      //   order: 6,
      // }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getUserFiltersQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        required: false,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: false,
        order: 2,
      }),
      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        required: false,
        order: 3,
      }),
      new DropdownQuestion({
        key: 'gender',
        label: 'Gender',
        options: [
          { key: 'male', value: 'Male' },
          { key: 'female', value: 'Female' },
        ],
        order: 4,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getUserAddRoleQuestions() {
    const questions: QuestionBase<string>[] = [
      new DropdownQuestion({
        key: 'role',
        label: 'Role',
        options: [
          { key: 'user', value: 'user' },
          { key: 'admin', value: 'admin' },
          { key: 'superadmin', value: 'superadmin' },
        ],
        order: 4,
      }),
      new RadioQuestion({
        key: 'question1',
        label: 'What is your gender?',
        type: 'radio',
        options: [
          { key: 'male', value: 'Male' },
          { key: 'female', value: 'Female' },
        ],
      }),
      new RadioQuestion({
        key: 'question2',
        label: 'What are your hobbies?',
        type: 'checkbox',
        options: [
          { key: 'reading', value: 'Reading' },
          { key: 'sports', value: 'Sports' },
        ],
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getPrequalificationQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'title',
        label: 'Title',
        required: true,
        order: 1,
      }),
      new TextareaQuestion({
        key: 'description',
        label: 'Description',
        type: 'textarea',
        richText: true,
        required: true,
        order: 2,
      }),
      new TextboxQuestion({
        key: 'openDate',
        label: 'Open Date',
        type: 'date',
        required: true,
        order: 3,
      }),
      new TextboxQuestion({
        key: 'openTime',
        label: 'Open Time',
        type: 'time',
        required: true,
        order: 4,
      }),
      new TextboxQuestion({
        key: 'closingDate',
        label: 'Closing Date',
        type: 'date',
        required: true,
        order: 5,
      }),
      new TextboxQuestion({
        key: 'closingTime',
        label: 'Closing Time',
        type: 'time',
        required: true,
        order: 6,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
}
