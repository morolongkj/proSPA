import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  passwordForm!: FormGroup;
  currencyForm!: FormGroup;
  securityForm!: FormGroup;

  showNewPassword = false;
  showConfirmPassword = false;

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
  }
}