import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmService } from '../../_services/confirm.service';
import { ApiService } from '../../_services/api.service';
import { ToastService } from '../../_services/toast.service';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbAccordionModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private confirmService = inject(ConfirmService);
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  passwordForm!: FormGroup;
  currencyForm!: FormGroup;
  securityForm!: FormGroup;

  showNewPassword = false;
  showConfirmPassword = false;

  items = ['First', 'Second', 'Third'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize Forms
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.currencyForm = this.fb.group({
      currency: ['', Validators.required],
    });

    this.securityForm = this.fb.group({
      enable2FA: [false],
    });
  }

  // Toggle password visibility
  togglePasswordVisibility(type: string): void {
    if (type === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Handle Password Form Submission
  onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      console.log('Password Form Data:', this.passwordForm.value);
      // Handle submission logic
      const model = {
        current_password: this.passwordForm.value.currentPassword,
        new_password: this.passwordForm.value.newPassword,
        confirm_password: this.passwordForm.value.confirmPassword,
      };
      this.apiService.post('auth/change-password', model).subscribe({
        next: (response: any) => {
          console.log('Password changed successfully', response);
          this.toastService.success('Password changed successfully');
          this.passwordForm.reset();
        }
      });
    }
  }

  // Handle Currency Form Submission
  onSubmitCurrency(): void {
    if (this.currencyForm.valid) {
      console.log('Currency Form Data:', this.currencyForm.value);
      // Handle submission logic
    }
  }

  // Handle Security Form Submission
  onSubmitSecurity(): void {
    console.log('Security Form Data:', this.securityForm.value);
    // Handle submission logic
  }

  // Handle Account Deactivation
  deactivateAccount(): void {
    console.log('Account Deactivated');
    // Handle deactivation logic
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to deativate your account?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.apiService.delete('auth/deactivate-account').subscribe({
            next: (response: any) => {
              console.log('Deactivation successful', response);
              this.toastService.success('Deactivation successful');
              this.authService.logout();
            },
            error: (err: any) => {
              console.error('Error deactivating account', err);
              this.toastService.success('Error deactivating account');
            },
          });
        }
      });
  }
}
