import { Component, Input } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-input.component.html',
  styleUrl: './dynamic-input.component.css'
})
export class DynamicInputComponent {
  @Input() field: any;
  formName: FormGroup;

  constructor(private formgroupDirective: FormGroupDirective) {
    this.formName = formgroupDirective.control;
  }
}
