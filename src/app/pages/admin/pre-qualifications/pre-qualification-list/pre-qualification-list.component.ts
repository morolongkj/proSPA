import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, tap, finalize, takeUntil } from 'rxjs';
import { QuestionnaireService } from '../../../../_services/questionnaire.service';
import { ToastService } from '../../../../_services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SubmissionDetailsComponent } from '../../../_components/submission-details/submission-details.component';
import { UpdateSubmissionStatusComponent } from '../../../_components/update-submission-status/update-submission-status.component';

@Component({
  selector: 'app-pre-qualification-list',
  standalone: true,
  imports: [
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    SubmissionDetailsComponent,
    UpdateSubmissionStatusComponent,
  ],
  templateUrl: './pre-qualification-list.component.html',
  styleUrl: './pre-qualification-list.component.css',
})
export class PreQualificationListComponent implements OnInit {
  private questionnaireService = inject(QuestionnaireService);
  private toastService = inject(ToastService);

  submissions: any[] = [];
  selectedSubmission: any = {};

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = true;

  filters: any = {};
  private unsubscribe$ = new Subject<void>();

  view: string = 'details';
  currentStatus: string = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getSubmissions();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getSubmissions() {
    this.questionnaireService
      .getQuestionnaireSubmissions(this.page, this.perPage, this.filters)
      .pipe(
        tap({
          next: (res: any) => {
            if (res) {
              console.log(res);
              this.submissions = res.data.submissions;
              this.total = res.data.total;
            }
          },
          error: (error) => alert(error),
        }),
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  handlePageChange(event: any): void {
    this.page = event;
    this.getSubmissions();
  }

  handlePageSizeChange(event: any): void {
    // if (JSON.stringify(this.filters) !== '{}') {
    this.perPage = event.target.value;
    this.page = 1;
    this.getSubmissions();
    // }
  }

  openModal(content: TemplateRef<any>, submission: any) {
    this.selectedSubmission = submission;
    console.log(this.selectedSubmission);
    this.modalService.open(content, {
      centered: false,
      size: 'lg',
      scrollable: true,
    });
  }

  onApprove() {
    this.currentStatus = 'Approved';
    this.view = 'approve';
  }

  onReject() {
    this.currentStatus = 'Rejected';
    this.view = 'reject';
  }

  viewDetails() {
    this.currentStatus = '';
    this.view = 'details';
  }

  onSamplePassed() {
    this.currentStatus = 'Sample Passed';
    this.view = 'sample-passed';
  }

  onSampleFailed() {
    this.currentStatus = 'Sample Failed';
    this.view = 'sample-failed';
  }

  onQualified() {
    this.currentStatus = 'Qualified';
    this.view = 'qualified';
  }
}
