import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Heading,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Link,
  List,
} from 'ckeditor5';
import { QuestionnaireService } from '../../../../../_services/questionnaire.service';

@Component({
  selector: 'app-submit-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  templateUrl: './submit-questionnaire.component.html',
  styleUrl: './submit-questionnaire.component.css',
})
export class SubmitQuestionnaireComponent implements OnInit {
  private questionnaireService = inject(QuestionnaireService);
  @Input() questionnaire: any = {};
  form: FormGroup;

  public Editor = ClassicEditor;
  public config = {
    height: '400px',
    toolbar: [
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'link',
      '|',
      'heading',
      '|',
      'bulletedList',
      'numberedList',
    ],
    plugins: [
      Heading,
      Bold,
      Essentials,
      Italic,
      Mention,
      Paragraph,
      Undo,
      Link,
      List,
    ],

    // licenseKey: '<YOUR_LICENSE_KEY>',
    mention: {
      // Mention configuration
      feeds: [
        {
          marker: '@',
          feed: ['@user', '@jane', '@foo', '@bar'],
          minimumCharacters: 1,
        },
      ],
    },
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      message: ['', Validators.required], // Textarea input
      attachments: this.fb.array([]), // FormArray for attachments
    });
  }

  ngOnInit(): void {}

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

      const formData = new FormData();
      formData.append('message', this.form.value.message);
      this.form.value.attachments.forEach((attachment: any, index: number) => {
        if (attachment.file) {
          formData.append(`attachments[${index}][file_name]`, attachment.name);
          formData.append(`attachments[${index}][file]`, attachment.file);
        }
      });

      console.log(formData);
      this.prequalificationService.submitQ
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
