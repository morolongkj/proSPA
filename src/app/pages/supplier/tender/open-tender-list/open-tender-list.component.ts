import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from '../../../../_services/toast.service';
import { Subject, tap, finalize, takeUntil } from 'rxjs';
import { TenderService } from '../../../../_services/tender.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TenderDetailsComponent } from '../tender-details/tender-details.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-tender-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, TenderDetailsComponent, FormsModule],
  templateUrl: './open-tender-list.component.html',
  styleUrl: './open-tender-list.component.css',
})
export class OpenTenderListComponent implements OnInit {
  private tenderService = inject(TenderService);
  private toastService = inject(ToastService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  tenders: any[] = [];
  selectedTender: any = {};

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = true;

  filters: any = {};
  private unsubscribe$ = new Subject<void>();

  searchText: string = '';

  constructor() {}

  ngOnInit(): void {
    this.filters.status = 'Published';
    this.getTenders();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getTenders() {
    this.tenderService
      .getTenders(this.page, this.perPage, this.filters)
      .pipe(
        tap({
          next: (res: any) => {
            if (res) {
              console.log(res);
              this.tenders = res.data.tenders;
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
    this.getTenders();
  }

  handlePageSizeChange(event: any): void {
    // if (JSON.stringify(this.filters) !== '{}') {
    this.perPage = event.target.value;
    this.page = 1;
    this.getTenders();
    // }
  }

  openModal(content: TemplateRef<any>, tender: any) {
    this.selectedTender = tender;
    console.log(this.selectedTender);
    this.modalService.open(content, {
      centered: false,
      size: 'lg',
      scrollable: true,
    });
  }

  onSearch(searchText: string): void {
    this.searchText = searchText;
    console.log('Search initiated with text:', this.searchText);
    this.filters.searchTerm = this.searchText;
    this.getTenders();
  }

  clearSearch(): void {
    this.searchText = '';
    this.filters.searchTerm = this.searchText;
    this.getTenders();
  }

  prepareBid() {
    this.router.navigate(['supplier/bids/create/' + this.selectedTender.id]);
    this.modalService.dismissAll();
  }
}
