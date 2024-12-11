import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../_services/toast.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bid-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bid-create.component.html',
  styleUrl: './bid-create.component.css',
})
export class BidCreateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  tender: any = {};

  bidForm: FormGroup;
  selectedProducts: any[] = [];
  bidFiles: (File | null)[] = [];

  constructor(private fb: FormBuilder) {
    this.bidForm = this.fb.group({
      selectedProducts: this.fb.array([], Validators.required),
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log(data);
      this.tender = data['tender'];
    });
  }

  // Getter for form array
  get selectedProductsArray(): FormArray {
    return this.bidForm.get('selectedProducts') as FormArray;
  }

  // Toggle product selection
  toggleProductSelection(product: any): void {
    const selectedIndex = this.selectedProducts.findIndex(
      (p) => p.id === product.id
    );

    if (selectedIndex === -1) {
      // Add product to the selection
      this.selectedProducts.push({
        ...product,
        bidQuantity: '',
        bidPrice: '',
        bidComment: '',
      });
    } else {
      // Remove product from the selection
      this.selectedProducts = this.selectedProducts.filter(
        (p) => p.id !== product.id
      );
    }
  }

  // Check if a product is selected
  isProductSelected(product: any): boolean {
    return this.selectedProducts.some((p) => p.id === product.id);
  }

  // Update a field for a product
  updateProductField(product: any, field: string, value: any): void {
    const selectedProduct = this.selectedProducts.find(
      (p) => p.id === product.id
    );
    if (selectedProduct) {
      selectedProduct[field] = value;
    }
  }

  // Add a new file input
  addFileInput(): void {
    this.bidFiles.push(null); // Add a placeholder for the new file
  }

  // Handle file selection
  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.bidFiles[index] = file;
    }
  }

  // Submit the bid
  submitBid(): void {
    if (this.selectedProducts.length > 0 && this.bidFiles.length > 0) {
      console.log('Bid submitted:', this.selectedProducts, this.bidFiles);
      alert('Bid successfully prepared with attachments!');
    } else {
      alert('Please select at least one product and attach files to submit.');
    }
  }
}
