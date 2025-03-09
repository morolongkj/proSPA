import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NgbModal,
  NgbPopoverModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmService } from '../../../_services/confirm.service';
import { QuestionnaireService } from '../../../_services/questionnaire.service';
import { ToastService } from '../../../_services/toast.service';


@Component({
  selector: 'app-questionnaire-documents',
  standalone: true,
  imports: [
    FormsModule,
    NgbPopoverModule,
    NgbTooltipModule,
    RouterLink,
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
  ],
  templateUrl: './questionnaire-documents.component.html',
  styleUrl: './questionnaire-documents.component.css',
})
export class QuestionnaireDocumentsComponent {
  private modalService = inject(NgbModal);
  private questionnaireService = inject(QuestionnaireService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);

  @Input() questionnaire: any;
  selectedFile: File | null = null;
  fileName = '';

  progress = 0;
  currentAttachment: any = {};

  constructor() {}

  attachFile(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  // Method to handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.selectedFile) {
      console.log('File ready for upload:', this.selectedFile);
      // Handle the actual file upload logic here
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('questionnaire_id', this.questionnaire.id);
      formData.append('file_name', this.fileName);
      this.questionnaireService.addQuestionnaireDocument(formData).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.progress = Math.round((100 * event.loaded) / event.total);
              console.log(this.progress);
            }
          } else if (event.type === HttpEventType.Response) {
            Object.assign(this.currentAttachment, event.body);
            this.toastService.success('File upload is successful');
            this.questionnaire.attachments.push(
              this.currentAttachment.QuestionnaireDocument
            );

            this.modalService.dismissAll();
          }
        },
        (error: any) => {
          // Handle error
          // console.log('Upload failed!');
          this.toastService.error('Upload failed!');
        }
      );
    }
  }

  // Method to delete an attachment
  deleteQuestionnaireDocument(attachment: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${attachment.file_name}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.questionnaireService
            .deleteQuestionnaireDocument(attachment.id)
            .subscribe({
              next: (response: any) => {
                console.log('Delete successful', response);
                this.toastService.success('Delete successful');
                this.questionnaire.attachments =
                  this.questionnaire.attachments.filter(
                    (item: any) => item.id !== attachment.id
                  );
              },
              error: (err: any) => {
                console.error('Error deleting product', err);
                this.toastService.success('Error deleting an attachment');
              },
            });
        }
      });
  }
}
