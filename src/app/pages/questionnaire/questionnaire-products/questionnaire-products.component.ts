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
  @Input() questionnaire: any;

  productModel = {
    product_id: '',
    questionnaire_id: '',
  };

  products: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.productModel.questionnaire_id = this.questionnaire.id;
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

  addProduct(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  // Method to handle form submission
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted!', this.productModel);
      // Perform any action you need with the form data here
      this.questionnaireService.addQuestionnaireProduct(this.productModel).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toastService.success(res.message);
          this.productModel = {
            product_id: '',
            questionnaire_id: this.questionnaire.id,
          };
          this.modalService.dismissAll();
          this.questionnaire.products.push(res.questionnaireProduct);
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
          this.questionnaireService.deleteQuestionnaireProduct(product.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.questionnaire.products = this.questionnaire.products.filter(
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
