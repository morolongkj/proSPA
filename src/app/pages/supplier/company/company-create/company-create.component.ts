import { Component, inject, OnInit, ViewChild } from '@angular/core';
import AOS from 'aos';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { CompanyService } from '../../../../_services/company.service';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../_form/input/input.component';
import { SelectInputComponent } from '../../../../_form/select-input/select-input.component';

@Component({
  selector: 'app-company-create',
  standalone: true,
  providers: [QuestionService],
  imports: [
    AsyncPipe,
    DynamicFormComponent,
    RouterLink,
    InputComponent,
    SelectInputComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.css',
})
export class CompanyCreateComponent implements OnInit {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private companyService = inject(CompanyService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  companyForm!: FormGroup;

  companyForms = ['Individual', 'Partnership', 'Corporation', 'Other'];
  countries = ['Lesotho', 'South Africa', 'Malawi', 'Botswana', 'Zimbabwe'];
  showSpecifyField = false;

  companyFormOptions = this.companyForms.map((form) => ({
    key: form,
    value: form,
  }));

  countryOptions = this.countries.map((country) => ({
    key: country,
    value: country,
  }));

  constructor(service: QuestionService) {
    this.questions$ = service.getCompanyQuestions();
  }

  ngOnInit(): void {
    AOS.init();
    this.createForm();
    this.handleCompanyFormChange();
  }

  createForm() {
    this.companyForm = this.fb.group({
      company_name: ['', Validators.required],
      year_established: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{4}$/)],
      ],
      company_form: ['', Validators.required],
      specify_company_form: [''],
      legal_status: [''],
      trade_registration_number: ['', Validators.required],
      vat_number: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      telefax: [''],
      telex: [''],
    });
  }

  handleCompanyFormChange() {
    this.companyForm.get('company_form')?.valueChanges.subscribe((value) => {
      this.showSpecifyField = value === 'Other';
      if (!this.showSpecifyField) {
        this.companyForm.get('specify_company_form')?.reset();
      }
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      console.log('Form Submitted:', this.companyForm.value);
         this.companyService.addCompany(this.companyForm.value).subscribe({
           next: (res: any) => {
             console.log(res);
             if (res['status']) {
               //successful
               // Successful response
               const companyId = res.company?.id; // Extract company ID from the response
               if (companyId) {
                 // Retrieve user object from localStorage
                 const user = JSON.parse(localStorage.getItem('user') ?? '{}');

                 // Update user object with company_id
                 user.company_id = companyId;

                 // Save updated user object back to localStorage
                 localStorage.setItem('user', JSON.stringify(user));
               }
               this.toastService.success('Company is created successfully!');
               this.companyForm.reset();
               this.router.navigate(['/']);
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

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      company_name: event.formData.companyName,
      year_established: event.formData.yearEstablished,
      company_form: event.formData.companyForm,
      specify_company_form: event.formData.specifyCompanyForm,
      legal_status: event.formData.legalStatus,
      trade_registration_number: event.formData.tradeRegistrationNumber,
      vat_number: event.formData.vatNumber,
      address: event.formData.address,
      country: event.formData.country,
      telephone: event.formData.telephone,
      email: event.formData.email,
    };
    this.companyService.addCompany(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          // Successful response
          const companyId = res.company?.id; // Extract company ID from the response
          if (companyId) {
            // Retrieve user object from localStorage
            const user = JSON.parse(localStorage.getItem('user') ?? '{}');

            // Update user object with company_id
            user.company_id = companyId;

            // Save updated user object back to localStorage
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.toastService.success('Company is created successfully!');
          this.dynamicFormComponent.resetForm();
          this.router.navigate(['/']);
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
