import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../_services/company.service';
import { ToastService } from '../../../../_services/toast.service';
import AOS from 'aos';
import { InputComponent } from '../../../../_form/input/input.component';
import { SelectInputComponent } from '../../../../_form/select-input/select-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-edit',
  standalone: true,
  imports: [
    InputComponent,
    SelectInputComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './company-edit.component.html',
  styleUrl: './company-edit.component.css',
})
export class CompanyEditComponent implements OnInit {
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
  company: any = {};

  private route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.log(data);
      this.company = data['company'];
      this.createForm();
    });
    AOS.init();
    this.handleCompanyFormChange();
  }

  createForm() {
    this.companyForm = this.fb.group({
      company_name: [this.company?.company_name, Validators.required],
      year_established: [
        this.company?.year_established,
        [Validators.required, Validators.pattern(/^[0-9]{4}$/)],
      ],
      company_form: [this.company?.company_form, Validators.required],
      specify_company_form: [this.company?.specify_company_form],
      legal_status: [this.company?.legal_status],
      trade_registration_number: [
        this.company?.trade_registration_number,
        Validators.required,
      ],
      vat_number: [this.company?.vat_number, Validators.required],
      address: [this.company?.address, Validators.required],
      country: [this.company?.country, Validators.required],
      telephone: [this.company?.telephone, Validators.required],
      email: [this.company?.email, [Validators.required, Validators.email]],
      website: [this.company?.website],
      telefax: [this.company?.telefax],
      telex: [this.company?.telex],
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
      this.companyService
        .updateCompany(this.company?.id, this.companyForm.value)
        .subscribe({
          next: (res: any) => {
            this.toastService.success('Company is updated successfully!');
            this.companyForm.reset();
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }
}
