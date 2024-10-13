import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, OnInit, inject, ViewChild, TemplateRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgbPopoverModule, NgbTooltipModule, NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgOptionHighlightModule } from "@ng-select/ng-option-highlight";
import { NgSelectModule } from "@ng-select/ng-select";
import { ClassicEditor, Heading, Bold, Essentials, Italic, Mention, Paragraph, Undo, Link, List } from "ckeditor5";
import { NgxPaginationModule } from "ngx-pagination";
import { Observable } from "rxjs";
import { DynamicFormComponent } from "../../../_form/dynamic-form/dynamic-form.component";
import { QuestionBase } from "../../../_models/question-base";
import { CategoryService } from "../../../_services/category.service";
import { ConfirmService } from "../../../_services/confirm.service";
import { QuestionService } from "../../../_services/question.service";
import { QuestionnaireService } from "../../../_services/questionnaire.service";
import { ToastService } from "../../../_services/toast.service";
import { ImageUploadComponent } from "../../../_shared/image-upload/image-upload.component";
import { QuestionnaireDocumentsComponent } from "../questionnaire-documents/questionnaire-documents.component";

@Component({
  selector: 'app-admin-questionnaire-list',
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
    NgSelectModule,
    NgOptionHighlightModule,
    CKEditorModule,
    ImageUploadComponent,
    NgbModule,
    QuestionnaireDocumentsComponent
],
  templateUrl: './questionnaire-list.component.html',
  styleUrl: './questionnaire-list.component.css',
})
export class QuestionnaireListComponent implements OnInit {
  private questionnaireService = inject(QuestionnaireService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private categoryService = inject(CategoryService);
  private modalService = inject(NgbModal);

  questionnaires: any[] = [];

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = false;

  filters: any = {};
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  currentQuestionnaire: any = {};

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
    this.questions$ = questionService.getCategoryFiltersQuestions();
  }

  ngOnInit(): void {
    this.getQuestionnaires();
  }

  getQuestionnaires() {
    this.questionnaireService
      .getQuestionnaires(this.page, this.perPage, this.filters)
      .subscribe({
        next: (res: any) => {
          this.questionnaires = res.data.questionnaires;
          this.total = res.data.total;
          console.log(this.questionnaires);
        },
      });
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getQuestionnaires();
  }

  handlePageSizeChange(event: any): void {
    this.perPage = event.target.value;
    this.page = 1;
    this.getQuestionnaires();
  }

  handleFormSubmit(event: any) {
    const model = {
      title: event.formData.title,
      description: event.formData.description || '',
    };
    this.filters = model;
    console.log(this.filters);
    this.page = 1;
    this.getQuestionnaires();
  }

  toggleEdit(questionnaire: any) {
    questionnaire.isEditing = !questionnaire.isEditing;
  }

  saveQuestionnaire(questionnaire: any) {
    questionnaire.isEditing = false;
    console.log(questionnaire);
    this.questionnaireService.updateQuestionnaire(questionnaire.id, questionnaire).subscribe({
      next: (res: any) => {
        Object.assign(questionnaire, res);
        const index = this.questionnaires.findIndex(
          (attr: any) => attr.id === questionnaire.id
        );
        if (index !== -1) {
          this.questionnaires[index] = questionnaire;
        }
        this.toastService.success('Updated successfully');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  deleteQuestionnaire(questionnaire: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${questionnaire.type}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.questionnaireService.deleteQuestionnaire(questionnaire.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.questionnaires = this.questionnaires.filter(
                (item: any) => item.id !== questionnaire.id
              );
            },
            error: (err: any) => {
              console.error('Error deleting questionnaire', err);
              this.toastService.success('Error deleting questionnaire');
            },
          });
        }
      });
  }

  openModal(content: TemplateRef<any>, questionnaire: any) {
    this.currentQuestionnaire = questionnaire;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
}
