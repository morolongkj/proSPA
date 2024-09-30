import { CommonModule } from '@angular/common';
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
import { TenderService } from '../../../../_services/tender.service';
import { HttpEventType } from '@angular/common/http';
import { ToastService } from '../../../../_services/toast.service';
import { ConfirmService } from '../../../../_services/confirm.service';

@Component({
  selector: 'app-tender-attachments',
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
  templateUrl: './tender-attachments.component.html',
  styleUrl: './tender-attachments.component.css',
})
export class TenderAttachmentsComponent {
  private modalService = inject(NgbModal);
  private tenderService = inject(TenderService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  
  @Input() tender: any;
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
      formData.append('tender_id', this.tender.id);
      formData.append('file_name', this.fileName);
      this.tenderService.addTenderAttachment(formData).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.progress = Math.round((100 * event.loaded) / event.total);
              console.log(this.progress);
            }
          } else if (event.type === HttpEventType.Response) {
            Object.assign(this.currentAttachment, event.body);
            this.toastService.success('File upload is successful');
            this.tender.attachments.push(
              this.currentAttachment.tenderAttachment
            );

            this.modalService.dismissAll();
          }
        },
        (error) => {
          // Handle error
          // console.log('Upload failed!');
          this.toastService.error('Upload failed!');
        }
      );
    }
  }

  // Method to delete an attachment
  deleteTenderAttachment(attachment: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${attachment.file_name}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.tenderService.deleteTenderAttachment(attachment.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.tender.attachments = this.tender.attachments.filter(
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
