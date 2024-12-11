import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { QuestionnaireService } from '../../../../_services/questionnaire.service';
import { ToastService } from '../../../../_services/toast.service';
import { tap, finalize, takeUntil, Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SubmitQuestionnaireComponent } from "./submit-questionnaire/submit-questionnaire.component";
import { FileDownloadService } from '../../../../_services/file-download.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-questionnaire-list',
  standalone: true,
  imports: [
    NgxPaginationModule,
    CommonModule,
    SubmitQuestionnaireComponent,
    FormsModule,
  ],
  templateUrl: './open-questionnaire-list.component.html',
  styleUrl: './open-questionnaire-list.component.css',
})
export class OpenQuestionnaireListComponent implements OnInit {
  private questionnaireService = inject(QuestionnaireService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);
  private fileDownloadService = inject(FileDownloadService);

  questionnaires: any[] = [];

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = false;
  filters: any = {
    status: 'open',
  };

  private unsubscribe$ = new Subject<void>();

  currentQuestionnaire: any = {};
  selectedProduct: any = null;

  constructor() {}

  ngOnInit(): void {
    this.loadQuestionnaires();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadQuestionnaires() {
    this.questionnaireService
      .getQuestionnaires(this.page, this.perPage, this.filters)
      .pipe(
        tap({
          next: (res: any) => {
            if (res) {
              this.questionnaires = res.data.questionnaires;
              console.log(this.questionnaires);
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
    this.loadQuestionnaires();
  }

  handlePageSizeChange(event: any): void {
    this.perPage = event.target.value;
    this.page = 1;
    this.loadQuestionnaires();
  }

  openModal(content: TemplateRef<any>, questionnaire: any) {
    this.currentQuestionnaire = questionnaire;
    console.log(this.selectedProduct);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  download(document: any): void {
    const fileUrl = 'https://example.com/path-to-your-file.pdf';
    const filename = 'downloaded-file.pdf';
    this.fileDownloadService.downloadFile(
      document.file_path,
      document.file_name
    );
  }
}
