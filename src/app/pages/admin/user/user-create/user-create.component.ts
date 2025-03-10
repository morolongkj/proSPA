import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
import { UserService } from '../../../../_services/user.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ApiService } from '../../../../_services/api.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  userForm!: FormGroup;

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
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        position: [''],
        phoneNumber: ['', [Validators.required]],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  get rolesFormArray() {
    return this.userForm.get('roles') as FormArray;
  }

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

  toggleRole(role: any) {
    if (this.selectedRoles.includes(role)) {
      this.selectedRoles = this.selectedRoles.filter((p) => p !== role);
    } else {
      this.selectedRoles.push(role);
    }
  }

  onSubmit() {
    this.isLoading = true;
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      const newUser = {
        first_name: formData.firstname,
        last_name: formData.lastname,
        position: formData.position,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        username: formData.email,
        password: formData.password,
        roles: this.selectedRoles.map((role) => role.value),
      };

      console.log('User Data:', newUser);
      // TODO: Send data to backend API using a service
      this.apiService.post('register', newUser).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res['status']) {
            //successful
            this.toastService.success('User is created successfully!');
            this.userForm.reset();
            this.selectedRoles = [];
            this.isLoading = false;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
