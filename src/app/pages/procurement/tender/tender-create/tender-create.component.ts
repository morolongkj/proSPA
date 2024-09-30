import { Component, inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { AsyncPipe } from '@angular/common';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { RouterLink } from '@angular/router';
import { TenderService } from '../../../../_services/tender.service';
import { ToastService } from '../../../../_services/toast.service';

@Component({
  selector: 'app-tender-create',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent, RouterLink],
  templateUrl: './tender-create.component.html',
  styleUrl: './tender-create.component.css',
})
export class TenderCreateComponent {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private tenderService = inject(TenderService);
  private toastService = inject(ToastService);

  constructor(service: QuestionService) {
    this.questions$ = service.getTenderQuestions();
  }

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      reference_number: event.formData.referenceNumber,
      title: event.formData.title,
      description: event.formData.description,
      opening_date: event.formData.openingDate,
      opening_time: event.formData.openingTime,
      closing_date: event.formData.closingDate,
      closing_time: event.formData.closingTime,
    };
    this.tenderService.addTender(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Tender is created successfully!');
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
