import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../../_services/api.service';
import { ToastService } from '../../../../_services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  [x: string]: any;
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userForm!: FormGroup;
  userId!: number;
  isLoading = false;

  roles = [
    { name: 'Super Admin', value: 'superadmin' },
    { name: 'Admin', value: 'admin' },
    { name: 'Procurement Manager', value: 'procurement_manager' },
    { name: 'Procurement Assistant', value: 'procurement_assistant' },
    { name: 'Vendor', value: 'vendor' },
    { name: 'Buyer', value: 'buyer' },
    { name: 'Auditor', value: 'auditor' },
    { name: 'Quality Assurance Manager', value: 'quality_assurance_manager' },
    {
      name: 'Quality Assurance Assistant',
      value: 'quality_assurance_assistant',
    },
    { name: 'Tender Board Member', value: 'tender_board_member' },
  ];

  genders = ['Male', 'Female', 'Other'];
  selectedRoles: any[] = [];
  user: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Get user ID from route params
    this.route.paramMap.subscribe((params) => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.loadUserData(this.userId);
      }
    });

    // Initialize form
    this.userForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        position: [''],
        phoneNumber: ['', [Validators.required]],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''], // Optional for edit
        confirmPassword: [''],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  // Load existing user data
  loadUserData(userId: number) {
    this.isLoading = true;
    this.apiService.get(`users/${userId}`).subscribe({
      next: (user: any) => {
        console.log(user);
        this.user = user;
        this.userForm.patchValue({
          firstname: user.first_name,
          lastname: user.last_name,
          position: user.position,
          phoneNumber: user.phone_number,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          email: user.username,
        });

        // Pre-select roles
        this.selectedRoles = this.roles
          .filter((role) => user.roles.includes(role.value))
          .map((role) => role.value); // Extract value directly

        console.log(this.selectedRoles);

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading user data:', err);
        this.isLoading = false;
      },
    });
  }

  // Role selection toggle
  toggleRole(role: any) {
    if (this.selectedRoles.includes(role.value)) {
      this.selectedRoles = this.selectedRoles.filter((p) => p !== role.value);
    } else {
      this.selectedRoles.push(role.value);
    }
  }

  // toggleRole(role: any) {
  //   if (this.selectedRoles.includes(role)) {
  //     this.selectedRoles = this.selectedRoles.filter((p) => p !== role);
  //   } else {
  //     this.selectedRoles.push(role);
  //   }
  // }

  // Password match validator
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  // Submit update
  onSubmit() {
    this.isLoading = true;
    console.log(this.selectedRoles);

    if (this.userForm.valid) {
      const formData = this.userForm.value;

      const updatedUser: any = {
        first_name: formData.firstname,
        last_name: formData.lastname,
        position: formData.position,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        username: formData.email,
        roles: this.selectedRoles,
      };

      // Only include password if it is not empty
      if (formData.password) {
        updatedUser['password'] = formData.password;
      }

      this.apiService.put(`users/${this.userId}`, updatedUser).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res['status']) {
            this.toastService.success('User is updated successfully!');
            this.router.navigate(['/users']);
          }
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error updating user:', err);
          this.isLoading = false;
        },
      });
    } else {
      console.log('Form is invalid');
      this.isLoading = false;
    }
  }
}
