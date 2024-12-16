import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { QuestionnaireService } from '../../../../_services/questionnaire.service';
import { Subject, tap, finalize, takeUntil } from 'rxjs';
import { ToastService } from '../../../../_services/toast.service';
import AOS from 'aos';
import { SubmissionDetailsComponent } from "../../../_components/submission-details/submission-details.component";

@Component({
  selector: 'app-prequalification-list',
  standalone: true,
  imports: [
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    SubmissionDetailsComponent,
  ],
  templateUrl: './prequalification-list.component.html',
  styleUrl: './prequalification-list.component.css',
})
export class PrequalificationListComponent implements OnInit {
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

  searchText: string = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    AOS.init();
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

  onSearch(searchText: string): void {
    this.searchText = searchText;
    console.log('Search initiated with text:', this.searchText);
    this.filters.searchTerm = this.searchText;
    this.getSubmissions();
  }

  clearSearch(): void {
    this.searchText = '';
    this.filters.searchTerm = this.searchText;
    this.getSubmissions();
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
}
