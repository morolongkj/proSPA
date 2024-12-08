import { Component, inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { AsyncPipe } from '@angular/common';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../../../_services/document.service';
import { ToastService } from '../../../../_services/toast.service';

@Component({
  selector: 'app-document-create',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent, RouterLink],
  templateUrl: './document-create.component.html',
  styleUrl: './document-create.component.css',
})
export class DocumentCreateComponent {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private documentService = inject(DocumentService);
  private toastService = inject(ToastService);

  constructor(service: QuestionService) {
    this.questions$ = service.getDocumentQuestions();
  }

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      title: event.formData.documentTitle,
      description: event.formData.documentDescription,
      display_order: event.formData.documentDisplayOrder,
    };
    this.documentService.addDocument(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Document is created successfully!');
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
