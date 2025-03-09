import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-error.component.html',
  styleUrl: './dynamic-error.component.css'
})
export class DynamicErrorComponent implements OnInit {
  formName!: FormGroup;
  @Input()
  fieldName!: string;

  constructor(private formgroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this.formName = this.formgroupDirective.control;
  }
}
