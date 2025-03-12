import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-questionnaire-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './questionnaire-filter.component.html',
  styleUrl: './questionnaire-filter.component.css'
})
export class QuestionnaireFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  filterForm!: FormGroup;


  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      description: [''],
    });

    // Trigger filtering when form values change
    this.filterForm.valueChanges.subscribe(() => {
      this.onFilterChange();
    });
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
