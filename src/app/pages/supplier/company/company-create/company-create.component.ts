import { Component, inject, OnInit, ViewChild } from '@angular/core';
import AOS from 'aos';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { CompanyService } from '../../../../_services/company.service';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-create',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent, RouterLink],
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.css',
})
export class CompanyCreateComponent implements OnInit {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private companyService = inject(CompanyService);
  private toastService = inject(ToastService);

  constructor(service: QuestionService) {
    this.questions$ = service.getCompanyQuestions();
  }

  ngOnInit(): void {
    AOS.init();
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
          this.toastService.success('Company is created successfully!');
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
