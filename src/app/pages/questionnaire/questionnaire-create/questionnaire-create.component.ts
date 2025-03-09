import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../_models/question-base';
import { QuestionService } from '../../../_services/question.service';
import { QuestionnaireService } from '../../../_services/questionnaire.service';
import { ToastService } from '../../../_services/toast.service';


@Component({
  selector: 'app-questionnaire-create',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent, RouterLink],
  templateUrl: './questionnaire-create.component.html',
  styleUrl: './questionnaire-create.component.css',
})
export class QuestionnaireCreateComponent {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private questionnaireService = inject(QuestionnaireService);
  private toastService = inject(ToastService);

  constructor(service: QuestionService) {
    this.questions$ = service.getQuestionnaireQuestions();
  }

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      reference_number: event.formData.referenceNumber,
      title: event.formData.title,
      description: event.formData.description,
      open_from: event.formData.openFrom,
      open_until: event.formData.openUntil,
    };
    this.questionnaireService.addQuestionnaire(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Questionnaire is created successfully!');
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
