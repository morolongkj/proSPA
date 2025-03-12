import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NgbPopoverModule,
  NgbTooltipModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { ApiService } from '../../../../_services/api.service';
import { ConfirmService } from '../../../../_services/confirm.service';
import { ProductService } from '../../../../_services/product.service';
import { TenderService } from '../../../../_services/tender.service';
import { ToastService } from '../../../../_services/toast.service';

@Component({
  selector: 'app-tender-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbPopoverModule,
    NgbTooltipModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './tender-products.component.html',
  styleUrl: './tender-products.component.css',
})
export class TenderProductsComponent implements OnInit {
  private modalService = inject(NgbModal);
  private productService = inject(ProductService);
  private tenderService = inject(TenderService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private apiService = inject(ApiService);

  @Input() tender: any;

  productForm!: FormGroup;
  products: any[] = [];
  filteredProducts: any[] = [];
  paginatedProducts: any[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 50;
  totalPages = 0;

  isLoading = false;
  selectedProducts: string[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  // ✅ Initialize Reactive Form
  initForm(): void {
    this.productForm = this.fb.group({});
  }

  // ✅ Load Products from API
  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data.products;
        this.filteredProducts = [...this.products];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      },
    });
  }

  addProduct(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // ✅ Handle Search Logic
  filterProducts() {
    console.log('Search Term:', this.searchTerm);
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // ✅ Update Pagination
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.paginatedProducts = this.filteredProducts.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  // ✅ Handle Pagination
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

  get totalPagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  // ✅ Handle Product Selection
  toggleProductSelection(productId: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedProducts.includes(productId)) {
        this.selectedProducts.push(productId);
        this.productForm.addControl(
          productId,
          this.fb.control('', [Validators.required, Validators.min(1)])
        );
      }
    } else {
      this.selectedProducts = this.selectedProducts.filter(
        (id) => id !== productId
      );
      this.productForm.removeControl(productId);
    }
  }

  // ✅ Check if Product is Selected
  isProductSelected(productId: string): boolean {
    return this.selectedProducts.includes(productId);
  }

  // ✅ Handle Form Submission
  onSubmit() {
    if (this.productForm.valid && this.selectedProducts.length > 0) {
      const formData = this.selectedProducts.map((productId) => ({
        product_id: productId,
        quantity: this.productForm.value[productId],
        tender_id: this.tender.id,
      }));

      console.log('Form Data:', formData);

      this.apiService.post('/tender-products', formData).subscribe({
        next: (res: any) => {
          console.log('Form submitted successfully:', res);
          this.toastService.success('Products added successfully');

          // ✅ Refresh product state
          this.resetFormState();
          this.selectedProducts = [];
          this.productForm.reset();
          this.loadProducts();
          console.log(this.tender.products);
          console.log("Res here: ",res);
          this.tender.products = [...this.tender.products, ...res.tenderProducts];
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          this.toastService.error('Error submitting form');
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // ✅ Reset State after Submission
  resetFormState() {
    this.selectedProducts = [];
    this.productForm.reset();
    this.loadProducts(); // ✅ Refresh products list
  }

  // ✅ Delete Tender Product
  deleteTenderProduct(product: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${product.code}?`
      )
      .then((confirmed) => {
        if (confirmed) {
          this.tenderService.deleteTenderProduct(product.id).subscribe({
            next: () => {
              this.toastService.success('Product deleted successfully');
              this.tender.products = this.tender.products.filter(
                (item: any) => item.id !== product.id
              );
            },
            error: (err) => {
              console.error('Error deleting product:', err);
              this.toastService.error('Error deleting product');
            },
          });
        }
      });
  }
}
