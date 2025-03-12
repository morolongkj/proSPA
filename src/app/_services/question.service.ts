import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { QuestionBase } from '../_models/question-base';
import { DropdownQuestion } from '../_models/question-dropdown';
import { TextboxQuestion } from '../_models/question-textbox';
import { TextareaQuestion } from '../_models/question-textarea';
import { RadioQuestion } from '../_models/question-radio';
import { CheckboxQuestion } from '../_models/question-checkbox';
import { TimeService } from './time.service';
@Injectable()
export class QuestionService {
  private timeService = inject(TimeService);
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
        key: 'firstName',
        label: 'First Name',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'lastName',
        label: 'Last Name',
        required: true,
        order: 2,
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

  getForgotPasswordQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        required: true,
        order: 1,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getChangePasswordQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'confirmPassword',
        label: 'Confirm Password',
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
      new TextareaQuestion({
        key: 'categoryDescription',
        label: 'Category Description',
        type: 'textarea',
        richText: true,
        required: true,
        order: 3,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getCategoryFiltersQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'title',
        label: 'Title',
        type: 'text',
        required: false,
        order: 1,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getDocumentQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'documentTitle',
        label: 'Document Title',
        required: true,
        order: 1,
      }),
      new TextareaQuestion({
        key: 'documentDescription',
        label: 'Document Description',
        type: 'textarea',
        richText: true,
        required: false,
        order: 3,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getDocumentFiltersQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'title',
        label: 'Title',
        type: 'text',
        required: false,
        order: 1,
      }),
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

  getExportQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'fileName',
        label: 'Filename',
        type: 'text',
        required: true,
        order: 1,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTenderQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'referenceNumber',
        label: 'Reference Number',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'title',
        label: 'Title',
        required: true,
        order: 2,
      }),
      new TextareaQuestion({
        key: 'description',
        label: 'Description',
        type: 'textarea',
        richText: true,
        required: true,
        order: 3,
      }),
      new TextboxQuestion({
        key: 'floatingDate',
        label: 'Floating Date',
        type: 'date',
        required: true,
        order: 4,
      }),
      new TextboxQuestion({
        key: 'floatingTime',
        label: 'Floating Time',
        type: 'time',
        required: true,
        order: 5,
      }),
      new TextboxQuestion({
        key: 'closingDate',
        label: 'Closing Date',
        type: 'date',
        required: true,
        order: 6,
      }),
      new TextboxQuestion({
        key: 'closingTime',
        label: 'Closing Time',
        type: 'time',
        required: true,
        order: 7,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getQuestionnaireQuestions() {
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
        key: 'openFrom',
        label: 'Open From',
        type: 'date',
        required: false,
        order: 3,
      }),
      new TextboxQuestion({
        key: 'openUntil',
        label: 'Open Until',
        type: 'date',
        required: false,
        order: 4,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getCompanyQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: 'companyName',
        label: 'Company Name',
        required: true,
        type: 'text',
        maxLength: 100,
        order: 1,
      }),
      new DropdownQuestion({
        key: 'yearEstablished',
        label: 'Year Established',
        options: this.timeService.generateYearsArray(
          new Date().getFullYear(),
          1900
        ),
        order: 2,
      }),
      new DropdownQuestion({
        key: 'companyForm',
        label: 'Form of the Company',
        options: [
          { key: 'Inidividual', value: 'Individual' },
          { key: 'Partnership', value: 'Partnership' },
          { key: 'Corporation', value: 'Corporation' },
          { key: 'Other', value: 'Other' },
        ],
        order: 3,
      }),
      new TextboxQuestion({
        key: 'specifyCompanyForm',
        label: 'Specify',
        required: false,
        type: 'text',
        order: 4,
      }),
      new TextboxQuestion({
        key: 'legalStatus',
        label: 'Legal Status',
        required: false,
        type: 'text',
        order: 5,
      }),
      new TextboxQuestion({
        key: 'tradeRegistrationNumber',
        label: 'Trade Registration Number',
        required: true,
        type: 'text',
        order: 6,
      }),
      new TextboxQuestion({
        key: 'vatNumber',
        label: 'VAT Number',
        required: true,
        type: 'text',
        order: 7,
      }),
      new TextareaQuestion({
        key: 'address',
        label: 'Address',
        type: 'textarea',
        richText: true,
        required: true,
        order: 8,
      }),
      new DropdownQuestion({
        key: 'country',
        label: 'Country',
        options: [
          { key: 'Lesotho', value: 'Lesotho' },
          { key: 'South Africa', value: 'South Africa' },
          { key: 'Malawi', value: 'Malawi' },
          { key: 'Botsoana', value: 'Botsoana' },
          { key: 'Zimbabwe', value: 'Zimbabwe' },
        ],
        order: 9,
      }),
      new TextboxQuestion({
        key: 'telephone',
        label: 'Telephone',
        required: true,
        type: 'text',
        order: 10,
      }),
      new TextboxQuestion({
        key: 'email',
        label: 'Email',
        required: true,
        type: 'text',
        order: 11,
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

}
