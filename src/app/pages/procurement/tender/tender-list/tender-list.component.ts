import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TenderService } from '../../../../_services/tender.service';
import { Observable } from 'rxjs';
import { DynamicFormComponent } from '../../../../_form/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../../../_models/question-base';
import { QuestionService } from '../../../../_services/question.service';
import { ToastService } from '../../../../_services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgbModal,
  NgbModule,
  NgbPopoverModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmService } from '../../../../_services/confirm.service';
import { CategoryService } from '../../../../_services/category.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
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
import { HttpEventType } from '@angular/common/http';
import { ImageUploadComponent } from '../../../../_shared/image-upload/image-upload.component';
import { TenderProductsComponent } from '../tender-products/tender-products.component';
import { TenderAttachmentsComponent } from '../tender-attachments/tender-attachments.component';
import { HasRoleDirective } from '../../../../_directives/has-role.directive';

@Component({
  selector: 'app-admin-tender-list',
  standalone: true,
  providers: [QuestionService],
  imports: [
    NgxPaginationModule,
    FormsModule,
    AsyncPipe,
    DynamicFormComponent,
    NgbPopoverModule,
    NgbTooltipModule,
    RouterLink,
    CommonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    CKEditorModule,
    NgbModule,
    TenderProductsComponent,
    TenderAttachmentsComponent,
    HasRoleDirective
],
  templateUrl: './tender-list.component.html',
  styleUrl: './tender-list.component.css',
})
export class TenderListComponent implements OnInit {
  private tenderService = inject(TenderService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private categoryService = inject(CategoryService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);

  tenders: any[] = [];

  page = 1;
  perPage = 1;
  total = 0;
  pageSizes = [1, 2, 5, 10, 15];
  isLoading = false;

  filters: any = {};
  questions$: Observable<QuestionBase<any>[]>;
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;

  currentTender: any = {};

  categories: any[] = [];
  categoriesLoading: boolean = false;

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

  progress: number = 0;

  tenderStatusList: any[] = [];
  showRemarksInput: boolean = false;
  remarks: string = '';

  selectedTender: any = {};

  constructor(questionService: QuestionService) {
    this.questions$ = questionService.getCategoryFiltersQuestions();
  }

  ngOnInit(): void {
    // this.getTenders();
    this.categoriesLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        res.data.categories.forEach((element: { id: any; title: any }) =>
          this.categories.push({
            label: element.title,
            value: element.id,
          })
        );
        this.categoriesLoading = false;
      },
    });
    this.getTenderStatusList();
    this.route.queryParams.subscribe((params) => {
      const current_status_id = params['status'];
      if (current_status_id) {
        this.filters.current_status_id = current_status_id;
      } else {
        this.filters = {};
      }
      this.getTenders();
    });
  }

  getTenders() {
    this.total = 0;
    this.tenderService
      .getTenders(this.page, this.perPage, this.filters)
      .subscribe({
        next: (res: any) => {
          this.tenders = res.data.tenders;
          this.total = res.data.total;
        },
      });
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getTenders();
  }

  handlePageSizeChange(event: any): void {
    this.perPage = event.target.value;
    this.page = 1;
    this.getTenders();
  }

  handleFormSubmit(event: any) {
    const model = {
      title: event.formData.title,
      description: event.formData.description || '',
    };
    this.filters = model;
    console.log(this.filters);
    this.page = 1;
    this.getTenders();
  }

  toggleEdit(tender: any) {
    tender.isEditing = !tender.isEditing;
  }

  saveTender(tender: any) {
    tender.isEditing = false;
    console.log(tender);
    this.tenderService.updateTender(tender.id, tender).subscribe({
      next: (res: any) => {
        Object.assign(tender, res);
        const index = this.tenders.findIndex(
          (attr: any) => attr.id === tender.id
        );
        if (index !== -1) {
          this.tenders[index] = tender;
        }
        this.toastService.success('Updated successfully');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  deleteTender(tender: any) {
    this.confirmService
      .confirm(
        'Confirm Deletion',
        `Are you sure you want to delete tender: ${tender.reference_number}?`
      )
      .then((confirmed: any) => {
        if (confirmed) {
          this.tenderService.deleteTender(tender.id).subscribe({
            next: (response: any) => {
              console.log('Delete successful', response);
              this.toastService.success('Delete successful');
              this.tenders = this.tenders.filter(
                (item: any) => item.id !== tender.id
              );
            },
            error: (err: any) => {
              console.error('Error deleting tender', err);
              this.toastService.success('Error deleting tender');
            },
          });
        }
      });
  }

  getTenderStatusList() {
    this.tenderService.getTenderStatusList().subscribe({
      next: (res: any) => {
        this.tenderStatusList = res.data.tenderStatuses;
      },
    });
  }

  updateStatus(tenderId: string, newStatus: string, remarks: string = '') {
    const current_status_id = this.getStatusId(newStatus);

    // Find the tender in the list by ID
    const tenderToUpdate = this.tenders.find(
      (tender) => tender.id === tenderId
    );

    if (tenderToUpdate) {
      // Log the updated tender
      console.log('Updated Tender:', tenderToUpdate);
      this.confirmService
        .confirm(
          'Confirm Status Change',
          `Are you sure you want to update tender: ${tenderToUpdate.reference_number}?`
        )
        .then((confirmed: any) => {
          if (confirmed) {
            this.tenderService
              .updateTender(tenderId, {
                current_status_id: current_status_id,
                remarks: remarks,
              })
              .subscribe({
                next: (res: any) => {
                  console.log(res);
                  // Update the tender's current status ID
                  tenderToUpdate.current_status_id = current_status_id;
                  tenderToUpdate.current_status = newStatus;
                  this.toastService.success('Status is updated successfully');
                },
                error: (err: any) => {
                  console.log(err);
                  this.toastService.error('Status could not be updated');
                },
              });
          }
        });
    } else {
      console.log('Tender not found.');
    }
  }

  rejectTender(tenderId: string, remarks: string) {
    // Your logic to reject the tender with the given remarks
    console.log(`Tender ID: ${tenderId}, Remarks: ${remarks}`);
    // Reset remarks and hide input after submission
    this.remarks = '';
    this.showRemarksInput = false;
    this.updateStatus(tenderId, 'Rejected', remarks);
  }

  submitApproval(tenderId: string, approvalType: string) {
    const tenderToUpdate = this.tenders.find(
      (tender) => tender.id === tenderId
    );

    if (tenderToUpdate) {
      // submit vote
      const model = {
        tender_id: tenderId,
        approval_type: approvalType,
      };
      this.tenderService.addTenderApproval(model).subscribe({
        next: (res: any) => {
          console.log(res.total_rejections);
          tenderToUpdate.total_approvals = res.total_approvals;
          tenderToUpdate.total_rejections = res.total_rejections;
          if (tenderToUpdate.total_approvals >= 3) {
            tenderToUpdate.current_status = 'Approved';
            tenderToUpdate.current_status_id = this.getStatusId('Approved');
          }
          if (tenderToUpdate.total_rejections >= 3) {
            tenderToUpdate.current_status = 'Rejected';
            tenderToUpdate.current_status_id = this.getStatusId('Rejected');
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  reCreateTender(tender: any) {
    const model = {
      reference_number: tender.reference_number,
      title: tender.title,
      description: tender.description,
      floating_date: tender.floating_date,
      floating_time: tender.floating_time,
      closing_date: tender.closing_date,
      closing_time: tender.closing_time,
      products: tender.products,
      attachments: tender.attachments,
    };
    this.tenderService.addTender(model).subscribe({
      next: (res: any) => {
        console.log(res);
        this.page = 1;
        this.getTenders();
        this.toastService.success(
          'New tender with same data is created successfully.'
        );
      },
      error: (err: any) => {
        console.log(err);
        this.toastService.error('Some error occured.');
      },
    });
  }

  publishTender(content: TemplateRef<any>, tender: any) {
    this.selectedTender = tender;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  isClosingAfterFloating(): boolean {
    const floatingDateTime = new Date(
      `${this.selectedTender.floating_date}T${this.selectedTender.floating_time}`
    );
    const closingDateTime = new Date(
      `${this.selectedTender.closing_date}T${this.selectedTender.closing_time}`
    );

    // Check if both floating and closing date/time values are valid
    if (
      !isNaN(floatingDateTime.getTime()) &&
      !isNaN(closingDateTime.getTime())
    ) {
      return closingDateTime > floatingDateTime;
    }
    return false;
  }

  onSubmit(form: any): void {
    if (form.valid && this.isClosingAfterFloating()) {
      console.log('Form submitted', this.selectedTender);
      this.selectedTender.current_status_id = this.getStatusId('Published');
      this.tenderService
        .updateTender(this.selectedTender.id, this.selectedTender)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.toastService.success('Tender is now public.');
            this.modalService.dismissAll();
          },
          error: (err: any) => {
            console.log(err);
            this.toastService.error(
              'Some errors occured, please contact the administrator.'
            );
          },
        });
    } else {
      console.error('Form is invalid');
    }
  }

  getStatusId(statusName: string): string | undefined {
    const matchingStatus = this.tenderStatusList.find(
      (status) => status.status === statusName
    );
    return matchingStatus ? matchingStatus.id : undefined;
  }

  openModal(content: TemplateRef<any>, tender: any) {
    this.currentTender = tender;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
}
