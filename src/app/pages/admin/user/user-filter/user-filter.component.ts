import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
})
export class UserFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  filterForm!: FormGroup;

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      gender: [''],
      role: [''],
    });

    // Trigger filtering when form values change
    // this.filterForm.valueChanges.subscribe(() => {
    //   this.onFilterChange();
    // });
  }

  // Emit filter data
  onFilterChange() {
    this.filterChanged.emit(this.filterForm.value);
  }

  // Reset filter
  resetForm() {
    this.filterForm.reset();
    this.onFilterChange(); // Emit event to clear filter
  }
}
