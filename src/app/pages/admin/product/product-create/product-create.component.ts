import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, map, never, Observable, of } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { ProductService } from '../../../../_services/product.service';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../_services/category.service';
import { CustomFormComponent } from '../../../../_form/custom-form/custom-form.component';

@Component({
  selector: 'app-admin-product-create',
  standalone: true,
  providers: [QuestionService],
  imports: [
    AsyncPipe,
    DynamicFormComponent,
    RouterLink,
    CustomFormComponent,
    CommonModule,
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
})
export class ProductCreateComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private categoryService = inject(CategoryService);
  @ViewChild(CustomFormComponent)
  customFormComponent!: CustomFormComponent;

  model: {
    title: {
      type: string;
      value: string;
      label: string;
      rules: {
        required: boolean;
      };
    };
    code: {
      type: string;
      value: string;
      label: string;
      rules: {
        required: boolean;
      };
    };
    description: {
      type: string;
      value: string;
      label: string;
      richText: boolean;
      rules: {
        required: boolean;
      };
    };
    category: {
      id: string;
      label: string;
      type: string;
      options: any[];
      rules: {
        required: boolean;
      };
    };
  } = {
    title: {
      type: 'text',
      value: '',
      label: 'Name/Title',
      rules: {
        required: true,
      },
    },
    code: {
      type: 'text',
      value: '',
      label: 'Product Code',
      rules: {
        required: true,
      },
    },
    description: {
      type: 'textarea',
      value: '',
      label: 'Description',
      richText: true,
      rules: {
        required: true,
      },
    },
    category: {
      id: 'category',
      label: 'Category',
      type: 'select',
      options: [],
      rules: {
        required: true,
      },
    },
  };

  constructor() {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        res.data.categories.forEach((element: { id: any; title: any }) =>
          this.model.category.options.push({
            label: element.title,
            value: element.id,
          })
        );
      },
    });
  }

  handleFormSubmit(event: any) {
    console.log('Form submitted:', event.formData);
    const model = {
      title: event.formData.title,
      code: event.formData.code,
      category_id: event.formData.category,
      description: event.formData.description,
    };
    this.productService.addProduct(model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Product is created successfully!');
          this.customFormComponent.resetForm();
        } else {
          this.toastService.error('Unknown error occured');
        }
      },
    });
  }
}
