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
import { AuthService } from '../../../../../_services/auth.service';
import { ToastService } from '../../../../../_services/toast.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-submit-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  templateUrl: './submit-questionnaire.component.html',
  styleUrl: './submit-questionnaire.component.css',
})
export class SubmitQuestionnaireComponent implements OnInit {
  private questionnaireService = inject(QuestionnaireService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

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

  companyId: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      message: ['', Validators.required], // Textarea input
      attachments: this.fb.array([]), // FormArray for attachments
    });
  }

  ngOnInit(): void {
    if (this.authService.getCompanyId() !== null) {
      this.companyId = this.authService.getCompanyId() ?? '';
    }
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
      if (this.companyId) {
        const formData = new FormData();
        formData.append('questionnaire_id', this.questionnaire.id);
        formData.append('company_id', this.companyId);
        formData.append('message', this.form.value.message);

        // formData.append('attachments[]',this.form.value.attachments);
        // this.form.value.attachments.forEach(
        //   (attachment: any, index: number) => {
        //     if (attachment.file) {
        //       formData.append(
        //         `attachments[${index}][file_name]`,
        //         attachment.name
        //       );
        //       formData.append(`attachments[${index}][file]`, attachment.file);
        //     }
        //   }
        // );

        this.form.value.attachments.forEach(
          (attachment: any, index: number) => {
            if (attachment.file) {
              formData.append(`attachments[]`, attachment.file);
              formData.append(`attachment_names[]`, attachment.name);
            }
          }
        );

        console.log(formData);
        this.questionnaireService
          .addQuestionnaireSubmission(formData)
          .subscribe({
            next: (res: any) => {
              console.log(res);
              this.form.reset();
              this.toastService.success('Submitted successfully.');
              this.router.navigate(['/supplier/prequalification']);
              this.modalService.dismissAll();
            },
            error: (err: any) => {
              console.log(err);
            },
          });
      } else {
        this.toastService.error(
          'This account is not linked to any company, and therefore cannot submit a questionnaire.'
        );
      }
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
