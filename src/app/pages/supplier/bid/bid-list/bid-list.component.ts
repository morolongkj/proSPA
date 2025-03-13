import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { BidService } from '../../../../_services/bid.service';
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, tap, finalize, takeUntil } from 'rxjs';
import { ToastService } from '../../../../_services/toast.service';
import AOS from 'aos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../../../_services/auth.service';

@Component({
  selector: 'app-bid-list',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule, NgbAccordionModule],
  templateUrl: './bid-list.component.html',
  styleUrl: './bid-list.component.css',
})
export class BidListComponent implements OnInit {
  private bidService = inject(BidService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  bids: any[] = [];
  selectedBid: any = {};

  page = 1;
  perPage = 10;
  total = 0;
  pageSizes = [10, 20, 30, 40, 50];
  isLoading = true;

  filters: any = {};
  private unsubscribe$ = new Subject<void>();

  searchText: string = '';
  companyId: string = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    AOS.init();
    this.companyId = this.authService.getCompanyId() ?? '';
    if (this.companyId) {
      this.filters.company_id = this.companyId;
      this.getBids();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getBids() {
    this.bidService
      .getBids(this.page, this.perPage, this.filters)
      .pipe(
        tap({
          next: (res: any) => {
            if (res) {
              console.log(res);
              this.bids = res.data.bids;
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
    this.getBids();
  }

  handlePageSizeChange(event: any): void {
    // if (JSON.stringify(this.filters) !== '{}') {
    this.perPage = event.target.value;
    this.page = 1;
    this.getBids();
    // }
  }

  onSearch(searchText: string): void {
    this.searchText = searchText;
    console.log('Search initiated with text:', this.searchText);
    this.filters.searchTerm = this.searchText;
    this.getBids();
  }

  clearSearch(): void {
    this.searchText = '';
    this.filters.searchTerm = this.searchText;
    this.getBids();
  }

  openModal(content: TemplateRef<any>, bid: any) {
    this.selectedBid = bid;
    console.log(this.selectedBid);
    this.modalService.open(content, {
      centered: false,
      size: 'lg',
      scrollable: true,
    });
  }
}
