import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CategoryService } from '../../../../_services/category.service';
import { ToastService } from '../../../../_services/toast.service';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { ClassicEditor, Heading, Bold, Essentials, Italic, Mention, Paragraph, Undo, Link, List } from 'ckeditor5';
import { ConfirmService } from '../../../../_services/confirm.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ImageUploadComponent } from "../../../../_shared/image-upload/image-upload.component";
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-category-list',
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
    NgbModule
],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private modalService = inject(NgbModal);

  categories: any[] = [];

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = false;

  filters: any = {};
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  currentCategory: any = {};

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
    this.getCategories();
  }

  getCategories() {
    this.categoryService
      .getCategories(this.page, this.perPage, this.filters)
      .subscribe({
        next: (res: any) => {
          this.categories = res.data.categories;
          this.total = res.data.total;
          console.log(this.categories);
        },
      });
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getCategories();
  }

  handlePageSizeChange(event: any): void {
    this.perPage = event.target.value;
    this.page = 1;
    this.getCategories();
  }

  handleFormSubmit(event: any) {
    const model = {
      title: event.formData.title,
      description: event.formData.description || "",
    };
    this.filters = model;
    console.log(this.filters);
    this.page = 1;
    this.getCategories();
  }

  toggleEdit(category: any) {
    category.isEditing = !category.isEditing;
  }

  saveCategory(category: any) {
    category.isEditing = false;
    console.log(category);
    this.categoryService.updateCategory(category.id, category).subscribe({
      next: (res: any) => {
        Object.assign(category, res);
        const index = this.categories.findIndex(
          (attr: any) => attr.id === category.id
        );
        if (index !== -1) {
          this.categories[index] = category;
        }
        this.toastService.success('Updated successfully');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  deleteCategory(category: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${category.title}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.categoryService.deleteCategory(category.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.categories = this.categories.filter(
                (item: any) => item.id !== category.id
              );
            },
            error: (err: any) => {
              console.error('Error deleting category', err);
              this.toastService.success('Error deleting category');
            },
          });
        }
      });
  }


  openModal(content: TemplateRef<any>, category: any) {
    this.currentCategory = category;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
