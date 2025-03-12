import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../_services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);

  profile: any = {};
  isLoading = false;

  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      position: ['', Validators.required],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      username: ['', Validators.required],
    });

    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.apiService.get('profile').subscribe({
      next: (res: any) => {
        const profile = res.data.user;
        this.profile = profile;
        if (profile) {
          this.profileForm.patchValue({
            firstname: profile.first_name || '',
            lastname: profile.last_name || '',
            position: profile.position || '',
            phone: profile.phone_number || '',
            dob: profile.date_of_birth || '',
            gender: profile.gender || '',
            username: profile.username || '',
          });
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
      },
    });
  }

  getInitials(firstname: string = '', lastname: string = ''): string {
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : '';
    const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.getRawValue(); // Get all fields, including disabled
      console.log('Submitting form:', formData);

      this.apiService.put('profile', formData).subscribe({
        next: (response) => {
          console.log('Profile updated:', response);
          this.toastService.success('Profile updated successfully');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.toastService.error('Error updating profile');
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
