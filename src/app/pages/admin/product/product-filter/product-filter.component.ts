import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css',
})
export class ProductFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();
  @Input() categories: any[] = [];

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      description: [''],
      category: [''],
    });

    // Trigger filter update when form values change
    this.filterForm.valueChanges.subscribe(() => {
      this.onFilterChange();
    });
  }

  onFilterChange() {
    this.filterChanged.emit(this.filterForm.value);
  }

  resetForm() {
    this.filterForm.reset();
    this.onFilterChange(); // Emit event to clear filter
  }
}
