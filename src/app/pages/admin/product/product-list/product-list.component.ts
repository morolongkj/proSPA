import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../../../_services/product.service';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
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
import { ConfirmService } from '../../../../_services/confirm.service';
import { CategoryService } from '../../../../_services/category.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
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
import { HttpEventType } from '@angular/common/http';
import { ImageUploadComponent } from '../../../../_shared/image-upload/image-upload.component';

@Component({
  selector: 'app-admin-product-list',
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
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private categoryService = inject(CategoryService);
  private modalService = inject(NgbModal);

  products: any[] = [];

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = false;

  filters: any = {};
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  currentProduct: any = {};

  categories: any[] = [];
  categoriesLoading: boolean = false;

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
    this.getProducts();
    this.categoriesLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        res.data.categories.forEach((element: { id: any; title: any }) =>
          this.categories.push({
            label: element.title,
            value: element.id,
          })
        );
        this.categoriesLoading = false;
      },
    });
  }

  getProducts() {
    this.productService
      .getProducts(this.page, this.perPage, this.filters)
      .subscribe({
        next: (res: any) => {
          this.products = res.data.products;
          this.total = res.data.total;
          console.log(this.products);
        },
      });
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getProducts();
  }

  handlePageSizeChange(event: any): void {
    this.perPage = event.target.value;
    this.page = 1;
    this.getProducts();
  }

  handleFormSubmit(event: any) {
    const model = {
      title: event.formData.title,
      description: event.formData.description || '',
    };
    this.filters = model;
    console.log(this.filters);
    this.page = 1;
    this.getProducts();
  }

  toggleEdit(product: any) {
    product.isEditing = !product.isEditing;
  }

  saveProduct(product: any) {
    product.isEditing = false;
    console.log(product);
    this.productService.updateProduct(product.id, product).subscribe({
      next: (res: any) => {
        Object.assign(product, res);
        const index = this.products.findIndex(
          (attr: any) => attr.id === product.id
        );
        if (index !== -1) {
          this.products[index] = product;
        }
        this.toastService.success('Updated successfully');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  deleteProduct(product: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${product.type}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.productService.deleteProduct(product.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.products = this.products.filter(
                (item: any) => item.id !== product.id
              );
            },
            error: (err: any) => {
              console.error('Error deleting product', err);
              this.toastService.success('Error deleting product');
            },
          });
        }
      });
  }

  openModal(content: TemplateRef<any>, product: any) {
    this.currentProduct = product;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
