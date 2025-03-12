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
import { ConfirmService } from '../../../_services/confirm.service';
import { ProductService } from '../../../_services/product.service';
import { QuestionnaireService } from '../../../_services/questionnaire.service';
import { ToastService } from '../../../_services/toast.service';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-questionnaire-products',
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
  templateUrl: './questionnaire-products.component.html',
  styleUrl: './questionnaire-products.component.css',
})
export class QuestionnaireProductsComponent implements OnInit {
  private modalService = inject(NgbModal);
  private productService = inject(ProductService);
  private questionnaireService = inject(QuestionnaireService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private apiService = inject(ApiService);
  @Input() questionnaire: any;

  productModel: any = {
    product_ids: [],
    questionnaire_id: '',
  };

  products: any[] = []; // Full product list
  filteredProducts: any[] = []; // Filtered product list
  paginatedProducts: any[] = []; // Products for the current page
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5; // Number of products per page
  totalPages: number = 0;

  isLoading = false;

  constructor() {}

  ngOnInit(): void {
    this.productModel.questionnaire_id = this.questionnaire.id;
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res.data.products;
        console.log(this.products);
        this.filteredProducts = [...this.products];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.paginatedProducts = this.filteredProducts.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  toggleProductSelection(productId: number, event: any) {
    if (event.target.checked) {
      if (!this.productModel.product_ids.includes(productId)) {
        this.productModel.product_ids.push(productId);
      }
    } else {
      this.productModel.product_ids = this.productModel.product_ids.filter(
        (id: any) => id !== productId
      );
    }
  }

  get totalPagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  addProduct(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // toggleProductSelection(productId: string, event: any) {
  //   if (event.target.checked) {
  //     // Add product ID if checked and not already in the array
  //     if (!this.productModel.product_ids.includes(productId)) {
  //       this.productModel.product_ids.push(productId);
  //     }
  //   } else {
  //     // Remove product ID if unchecked
  //     this.productModel.product_ids = this.productModel.product_ids.filter(
  //       (id: any) => id !== productId
  //     );
  //   }
  // }

  // Method to handle form submission
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted!', this.productModel);
      // Perform any action you need with the form data here
      this.questionnaireService
        .addQuestionnaireProduct(this.productModel)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.toastService.success(res.message);
            this.productModel = {
              product_ids: [],
              questionnaire_id: this.questionnaire.id,
            };
            this.modalService.dismissAll();
            // this.questionnaire.products.push(res.questionnaireProducts);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  // Method to delete a product
  deleteQuestionnaireProduct(product: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${product.code}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.questionnaireService
            .deleteQuestionnaireProduct(product.id)
            .subscribe({
              next: (response: any) => {
                console.log('Delete successful', response);
                this.toastService.success('Delete successful');
                this.questionnaire.products =
                  this.questionnaire.products.filter(
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
}
