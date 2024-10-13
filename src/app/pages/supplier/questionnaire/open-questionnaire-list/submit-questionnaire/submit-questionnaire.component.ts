import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './submit-questionnaire.component.html',
  styleUrl: './submit-questionnaire.component.css',
})
export class SubmitQuestionnaireComponent implements OnInit {
  @Input() questionnaire: any = {};
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      description: ['', Validators.required], // Textarea input
      attachments: this.fb.array([]), // FormArray for attachments
    });
  }

  ngOnInit(): void {

  }

  // Getter for attachments FormArray
  get attachments() {
    return this.form.get('attachments') as FormArray;
  }

  // Create a new attachment group (name input and file input)
  createAttachment(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required], // Attachment name
      file: [null, Validators.required], // File input (optional Validators)
    });
  }

  // Add a new attachment form group to the FormArray
  addAttachment() {
    this.attachments.push(this.createAttachment());
  }

  // Remove an attachment form group from the FormArray
  removeAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  // Handle form submission
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value); // Handle the form submission
    }
  }

  // Handle file input changes
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.attachments.at(index).patchValue({ file });
    }
  }
}
