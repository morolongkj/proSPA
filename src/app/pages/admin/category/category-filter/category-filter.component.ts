import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.css',
})
export class CategoryFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      description: [''],
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
