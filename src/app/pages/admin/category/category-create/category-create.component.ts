import { Component, inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { AsyncPipe } from '@angular/common';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../_services/category.service';
import { ToastService } from '../../../../_services/toast.service';

@Component({
  selector: 'app-category-create',
  standalone: true,
  providers: [QuestionService],
  imports: [AsyncPipe, DynamicFormComponent, RouterLink],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css',
})
export class CategoryCreateComponent {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  questions$: Observable<QuestionBase<any>[]>;
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  constructor(service: QuestionService) {
    this.questions$ = service.getCategoryQuestions();
  }

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      title: event.formData.categoryTitle,
      description: event.formData.categoryDescription,
      display_order: event.formData.categoryDisplayOrder,
    };
    this.categoryService.addCategory(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Category is created successfully!');
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
