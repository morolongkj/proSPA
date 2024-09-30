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
import { ProductService } from '../../../../_services/product.service';
import { TenderService } from '../../../../_services/tender.service';
import { ToastService } from '../../../../_services/toast.service';
import { ConfirmService } from '../../../../_services/confirm.service';

@Component({
  selector: 'app-tender-products',
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
  templateUrl: './tender-products.component.html',
  styleUrl: './tender-products.component.css',
})
export class TenderProductsComponent implements OnInit {
  private modalService = inject(NgbModal);
  private productService = inject(ProductService);
  private tenderService = inject(TenderService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  @Input() tender: any;

  productModel = {
    product_id: '',
    tender_id: '',
    quantity: 0,
  };

  products: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.productModel.tender_id = this.tender.id;
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data.products;
        console.log(this.products);
      },
    });
  }

  addproduct(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  // Method to handle form submission
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted!', this.productModel);
      // Perform any action you need with the form data here
      this.tenderService.addTenderProduct(this.productModel).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastService.success(res.message);
          this.productModel = {
            product_id: '',
            tender_id: this.tender.id,
            quantity: 0,
          };
          this.modalService.dismissAll();
          this.tender.products.push(res.tenderProduct);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  // Method to delete a product
  deleteTenderProduct(product: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete ${product.code}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.tenderService.deleteTenderProduct(product.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.tender.products = this.tender.products.filter(
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
