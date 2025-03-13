import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../_services/toast.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BidService } from '../../../../_services/bid.service';
import { AuthService } from '../../../../_services/auth.service';

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
  private bidService = inject(BidService);
  private authService = inject(AuthService);
  private router = inject(Router);

  tender: any = {};

  bidForm: FormGroup;
  selectedProducts: any[] = [];
  bidFiles: (File | null)[] = [];

  companyId: string = '';

  currencies = [
    { code: 'LSL', name: 'Lesotho Luti' },
    { code: 'ZAR', name: 'South Africa Rand' },
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
  ];

  constructor(private fb: FormBuilder) {
    this.bidForm = this.fb.group({
      selectedProducts: this.fb.array([]),
      attachments: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.authService.getCompanyId() !== null) {
      this.companyId = this.authService.getCompanyId() ?? '';
      console.log(this.companyId);
    } else {
      this.router.navigate(['/']);
      this.toastService.error(
        'Your account is not linked to any company profile.'
      );
    }
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
        unitPack: 1,
        quantityOffered: 0,
        currency: 'LSL',
        unitPrice: 0,
        totalPrice: 0,
        leadTime: 0,
        manufacture: '',
        country: '',
        registrationNumber: '',
        mra: '',
        shipmentWeight: 0,
        shipmentVolume: 0,
        comment: '',
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
  updateProductField(product: any, field: string, event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedProduct = this.selectedProducts.find(
      (p) => p.id === product.id
    );
    if (selectedProduct) {
      selectedProduct[field] = inputElement.value;
    }
  }

  // Add a new file input
  // addFileInput(): void {
  //   this.bidFiles.push(null); // Add a placeholder for the new file
  // }

  // // Handle file selection
  // onFileSelected(event: any, index: number): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.bidFiles[index] = file;
  //   }
  // }

  // Getter for attachments FormArray
  get attachments() {
    return this.bidForm.get('attachments') as FormArray;
  }

  // Create a new attachment group (name input and file input)
  createAttachment(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required], // Attachment name
      file: [null, Validators.required], // File input (optional Validators)
    });
  }

  // Add a new attachment form group to the FormArray
  addAttachment() {
    this.attachments.push(this.createAttachment());
  }

  // Remove an attachment form group from the FormArray
  removeAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  submitBid(): void {
    if (
      this.selectedProducts.length > 0 &&
      this.bidForm.value.attachments.length > 0
    ) {
      const formData = new FormData();

      // Add base fields
      formData.append('tender_id', this.tender.id);
      formData.append('company_id', this.companyId);

      // Add selected products to FormData
      this.selectedProducts.forEach((product: any, index: number) => {
        // Append each product as JSON string
        formData.append(`products[${index}][product_id]`, product.product_id);
        formData.append(`products[${index}][unit_pack]`, product.unitPack);
        formData.append(
          `products[${index}][quantity_offered]`,
          product.quantityOffered
        );
        formData.append(`products[${index}][currency]`, product.currency);
        formData.append(`products[${index}][unit_price]`, product.unitPrice);
        formData.append(`products[${index}][total_price]`, product.totalPrice);
        formData.append(`products[${index}][lead_time]`, product.leadTime);
        formData.append(`products[${index}][manufacture]`, product.manufacture);
        formData.append(
          `products[${index}][country_of_origin]`,
          product.country
        );
        formData.append(
          `products[${index}][registration_number]`,
          product.registrationNumber
        );
        formData.append(
          `products[${index}][medicine_regulatory_authority]`,
          product.mra
        );
        formData.append(
          `products[${index}][shipment_weight]`,
          product.shipmentWeight.toString()
        );
        formData.append(
          `products[${index}][shipment_volume]`,
          product.shipmentVolume.toString()
        );
        formData.append(`products[${index}][comments]`, product.comment || '');
      });

      // Add attachments to FormData
      this.bidForm.value.attachments.forEach(
        (attachment: any, index: number) => {
          if (attachment.file) {
            formData.append(`attachments[${index}]`, attachment.file); // Add file
            formData.append(`attachment_names[${index}]`, attachment.name); // Add name
          }
        }
      );

      // Log FormData contents (for debugging)
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Call the bid service to submit the bid
      this.bidService.addBid(formData).subscribe({
        next: (res: any) => {
          console.log('Bid submission response:', res);
          this.bidForm.reset();
          this.toastService.success('Bid successfully submitted!');
          this.router.navigate(['/supplier/bids']);
        },
        error: (err: any) => {
          console.error('Error submitting bid:', err);
          this.toastService.error('Failed to submit bid. Please try again.');
        },
      });
    } else {
      this.toastService.error(
        'Please select at least one product and attach files to submit.'
      );
    }
  }

  // submitBid(): void {
  //   if (
  //     this.selectedProducts.length > 0 &&
  //     this.bidForm.value.attachments.length > 0
  //   ) {
  //     const formData = new FormData();

  //     formData.append('tender_id', this.tender.id);
  //     formData.append('company_id', this.companyId);

  //     // Add selected products to FormData
  //     this.selectedProducts.forEach((product: any) => {
  //       formData.append('products[]', JSON.stringify(product)); // Assuming product is an object; stringify if needed
  //     });

  //     // Add attachments to FormData
  //     this.bidForm.value.attachments.forEach((attachment: any) => {
  //       if (attachment.file) {
  //         formData.append('attachments[]', attachment.file); // Add file
  //         formData.append('attachment_names[]', attachment.name); // Add name
  //       }
  //     });

  //     // Log FormData contents (for debugging)
  //     formData.forEach((value, key) => {
  //       console.log(`${key}:`, value);
  //     });

  //     // Call the bid service to submit the bid
  //     this.bidService.addBid(formData).subscribe({
  //       next: (res: any) => {
  //         console.log('Bid submission response:', res);
  //         this.toastService.success('Bid successfully submitted!');
  //       },
  //       error: (err: any) => {
  //         console.error('Error submitting bid:', err);
  //         this.toastService.error('Failed to submit bid. Please try again.');
  //       },
  //     });
  //   } else {
  //     this.toastService.error(
  //       'Please select at least one product and attach files to submit.'
  //     );
  //   }
  // }

  // Handle file input changes
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.attachments.at(index).patchValue({ file });
    }
  }
}
