import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DocumentService } from '../../../../_services/document.service';
import { ToastService } from '../../../../_services/toast.service';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbModal,
  NgbModule,
  NgbPopoverModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import {
  ClassicEditor,
  Heading,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Link,
  List,
} from 'ckeditor5';
import { ConfirmService } from '../../../../_services/confirm.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ImageUploadComponent } from '../../../../_shared/image-upload/image-upload.component';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-document-list',
  standalone: true,
  providers: [QuestionService],
  imports: [
    NgxPaginationModule,
    FormsModule,
    AsyncPipe,
    DynamicFormComponent,
    NgbPopoverModule,
    NgbTooltipModule,
    RouterLink,
    CommonModule,
    CKEditorModule,
    ImageUploadComponent,
    NgbModule,
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent implements OnInit {
  private documentService = inject(DocumentService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private modalService = inject(NgbModal);

  documents: any[] = [];

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = false;

  filters: any = {};
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  currentDocument: any = {};

  public Editor = ClassicEditor;
  public config = {
    height: '400px',
    toolbar: [
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'link',
      '|',
      'heading',
      '|',
      'bulletedList',
      'numberedList',
    ],
    plugins: [
      Heading,
      Bold,
      Essentials,
      Italic,
      Mention,
      Paragraph,
      Undo,
      Link,
      List,
    ],

    // licenseKey: '<YOUR_LICENSE_KEY>',
    mention: {
      // Mention configuration
      feeds: [
        {
          marker: '@',
          feed: ['@user', '@jane', '@foo', '@bar'],
          minimumCharacters: 1,
        },
      ],
    },
  };

  progress: number = 0;

  constructor(questionService: QuestionService) {
    this.questions$ = questionService.getDocumentFiltersQuestions();
  }

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments() {
    this.documentService
      .getDocuments(this.page, this.perPage, this.filters)
      .subscribe({
        next: (res: any) => {
          this.documents = res.data.documents;
          this.total = res.data.total;
          console.log(this.documents);
        },
      });
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getDocuments();
  }

  handlePageSizeChange(event: any): void {
    this.perPage = event.target.value;
    this.page = 1;
    this.getDocuments();
  }

  handleFormSubmit(event: any) {
    const model = {
      title: event.formData.title,
      description: event.formData.description || '',
    };
    this.filters = model;
    console.log(this.filters);
    this.page = 1;
    this.getDocuments();
  }

  toggleEdit(document: any) {
    document.isEditing = !document.isEditing;
  }

  saveDocument(document: any) {
    document.isEditing = false;
    console.log(document);
    this.documentService.updateDocument(document.id, document).subscribe({
      next: (res: any) => {
        Object.assign(document, res);
        const index = this.documents.findIndex(
          (attr: any) => attr.id === document.id
        );
        if (index !== -1) {
          this.documents[index] = document;
        }
        this.toastService.success('Updated successfully');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  deleteDocument(document: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${document.title}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.documentService.deleteDocument(document.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.documents = this.documents.filter(
                (item: any) => item.id !== document.id
              );
            },
            error: (err: any) => {
              console.error('Error deleting document', err);
              this.toastService.success('Error deleting document');
            },
          });
        }
      });
  }

  openModal(content: TemplateRef<any>, document: any) {
    this.currentDocument = document;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
}
