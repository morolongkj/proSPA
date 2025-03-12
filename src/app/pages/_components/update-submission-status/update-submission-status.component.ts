import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
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
import { QuestionnaireService } from '../../../_services/questionnaire.service';
import { ToastService } from '../../../_services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-update-submission-status',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  templateUrl: './update-submission-status.component.html',
  styleUrl: './update-submission-status.component.css',
})
export class UpdateSubmissionStatusComponent implements OnInit {
  private questionnaireService = inject(QuestionnaireService);
  private toastService = inject(ToastService);
  private apiService = inject(ApiService);
  @Input() submissionData: any = {};
  @Input() status: string = '';
  messageForm: FormGroup;

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

  @Output() messageEvent = new EventEmitter<string>();
  @Input() selectedProducts: any[] = [];

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    // Initialize the reactive form
    this.messageForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      messageBody: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    console.log(this.submissionData);
    console.log(this.selectedProducts);
    this.updateMessageBody(this.getSubject(), this.getMessage());
  }

  getSubject() {
    let subject = '';
    if (this.status === 'Approved') {
      subject = 'Submission approved, awaiting for samples';
    } else if (this.status === 'Rejected') {
      subject = 'Submission rejected';
    } else if (this.status === 'Sample Passed') {
      subject = 'Sample Passed';
    } else if (this.status === 'Sample Failed') {
      subject = 'Sample Failed';
    } else if (this.status === 'Qualified') {
      subject = `Congratulations! Prequalification Successfully Completed for ${this.submissionData.product?.title}`;
    } else {
      subject = '';
    }
    return subject;
  }

  getMessage() {
    let message = '';
    // Create a comma-separated list of product titles
    const productTitles = this.selectedProducts
      .map((p) => `<strong>${p.product_name}</strong>`)
      .join(', ');
    if (this.status === 'Approved') {
      message = `<p>Dear <strong>${this.submissionData.company?.company_name}</strong>,</p>
        <p>
        We are pleased to inform you that your submission for prequalification on the following products has been approved: ${productTitles}.
        Congratulations on successfully passing this stage on your prequalification journey!</p>
        <p>To proceed to the next stage, we kindly request that you provide the necessary samples as outlined in the  requirements.
         These samples will be evaluated to finalise your eligibility for supplying us with: ${productTitles}.</p>
        <div class="next-steps">
            <h5>Next Steps:</h5>
            <ul>
                <li>Prepare the required samples as per the provided guidelines.</li>
                <li>Ensure the samples are submitted</li>
                <li>Notify us once the samples have been sent or arrange for their delivery to <strong>NDSO</strong>.</li>
            </ul>
        </div>
        <p>Should you have any questions regarding the requirements or the next steps, please do not hesitate to contact us.</p>
        <p>We look forward to your timely submission of the samples to move forward in the process.</p>
        <p>Best regards,</p>`;
    } else if (this.status === 'Rejected') {
      message = `<p>Dear <strong>${this.submissionData.company?.company_name}</strong>,</p>
<p>We regret to inform you that your submission for prequalification on ${productTitles} has not been successful. Unfortunately, your submission did not meet the required criteria for this stage of the prequalification process.</p>
<p>We understand that this may be disappointing news, and we encourage you to review the submission requirements and address any areas for improvement.</p>
<div class="next-steps">
    <h5>Next Steps:</h5>
    <ul>
        <li>Review the feedback to understand the areas that need improvement.</li>
        <li>Prepare for future submissions by ensuring all requirements are met.</li>
        <li>Feel free to contact us for guidance or clarification on our prequalification criteria.</li>
    </ul>
</div>
<p>Should you have any questions or need further assistance, please do not hesitate to contact us.</p>
<p>We appreciate your effort and look forward to your participation in future.</p>
<p>Best regards,</p>
`;
    } else if (this.status === 'Sample Passed') {
      message = `<p>Dear <strong>${this.submissionData.company?.company_name}</strong>,</p>
<p>We are pleased to inform you that the sample provided for prequalification on  ${productTitles} has successfully met the required standards. Congratulations on passing this stage of the prequalification process!</p>
<p>We appreciate your effort in meeting the specified requirements and are excited to move forward with you to the next stage of the prequalification journey.</p>
<div class="next-steps">
    <h5>Next Steps:</h5>
    <ul>
        <li>Review any additional documentation or requirements for the final approval stage.</li>
        <li>Prepare for potential discussions or evaluations that may follow this stage.</li>
        <li>Ensure timely submission of any outstanding items as communicated by our team.</li>
    </ul>
</div>
<p>Should you have any questions or require further clarification, please do not hesitate to contact us. We remain committed to supporting you through the remaining stages of this process.</p>
<p>We look forward to finalizing the prequalification process with you and appreciate your dedication to meeting our standards.</p>
<p>Best regards,</p>
`;
    } else if (this.status === 'Sample Failed') {
      message = `<p>Dear <strong>${this.submissionData.company?.company_name}</strong>,</p>
<p>We regret to inform you that the sample provided for prequalification on  ${productTitles} did not meet the required standards. Unfortunately, this means your submission has not been successful at this stage of the prequalification process.</p>
<p>We understand that this may be disappointing news, and we encourage you to review the feedback provided and address the areas for improvement in your sample submission.</p>
<div class="next-steps">
    <h5>Next Steps:</h5>
    <ul>
        <li>Review the detailed feedback to identify the specific areas where the sample did not meet the criteria.</li>
        <li>Ensure that future samples adhere to the specified guidelines and quality standards.</li>
        <li>Contact us if you require clarification or additional guidance on the feedback provided.</li>
    </ul>
</div>
<p>Should you have any questions or require further assistance, please do not hesitate to contact us. We remain committed to supporting you in preparing for future opportunities.</p>
<p>We appreciate your effort and look forward to your participation in upcoming prequalification processes.</p>
<p>Best regards,</p>
`;
    } else if (this.status === 'Qualified') {
      message = `<p>Dear <strong>${this.submissionData.company?.company_name}</strong>,</p>
<p>We are pleased to inform you that you have successfully completed the prequalification process for  ${productTitles}. Congratulations on this significant achievement!</p>
<p>Your company is now eligible to participate in tenders for  ${productTitles}. This milestone reflects your dedication to meeting our stringent requirements and standards.</p>
<div class="next-steps">
    <h5>Next Steps:</h5>
    <ul>
        <li>Keep an eye on upcoming tender opportunities for  ${productTitles}.</li>
        <li>Ensure that all necessary documentation and compliance requirements remain up to date.</li>
        <li>Contact us if you need assistance or clarification regarding the tendering process.</li>
    </ul>
</div>
<p>We are excited about the possibility of working with you and look forward to your participation in future tender opportunities.</p>
<p>Should you have any questions or require additional information, please do not hesitate to reach out to us.</p>
<p>Best regards,</p>
`;
    } else {
      message = '';
    }

    return message;
  }

  updateMessageBody(subject: string, message: string): void {
    this.messageForm.patchValue({
      subject: subject,
      messageBody: message,
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.messageForm.valid) {
      // console.log('Form Data:', this.messageForm.value);
      // alert('Form submitted successfully!');
      const productIds = this.selectedProducts.map(
        (product) => product.product_id
      );
      const model = {
        status: this.status,
        subject: this.messageForm.value.subject,
        message: this.messageForm.value.messageBody,
        product_ids: productIds, // Include product IDs here
      };

      this.apiService
        .put(
          'questionnaire-submissions/update-status/' + this.submissionData.id,
          model
        )
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // this.toastService.success('');
            this.messageEvent.emit('Update is successful.');
            // this.modalService.dismissAll();
          },
          error: (err: any) => {
            console.log(err);
          },
        });

      // this.questionnaireService
      //   .updateQuestionnaireSubmissionStatus(this.submissionData.id, model)
      //   .subscribe({
      //     next: (res: any) => {
      //       console.log(res);
      //       // this.toastService.success('');
      //       this.messageEvent.emit('Update is successful.');
      //       // this.modalService.dismissAll();
      //     },
      //     error: (err: any) => {
      //       console.log(err);
      //     },
      //   });
    } else {
      this.toastService.error('Please fill out the form correctly.');
    }
  }
}
