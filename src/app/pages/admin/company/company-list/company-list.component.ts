import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { CompanyService } from '../../../../_services/company.service';
import { ToastService } from '../../../../_services/toast.service';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import AOS from 'aos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyDetailsComponent } from "../company-details/company-details.component";

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule, CompanyDetailsComponent],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css',
})
export class CompanyListComponent implements OnInit {
  private companyService = inject(CompanyService);
  private toastService = inject(ToastService);

  companies: any[] = [];
  selectedCompany: any = {};

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
    this.getCompanies();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getCompanies() {
    this.companyService
      .getCompanies(this.page, this.perPage, this.filters)
      .pipe(
        tap({
          next: (res: any) => {
            if (res) {
              console.log(res);
              this.companies = res.data.companies;
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
    this.getCompanies();
  }

  handlePageSizeChange(event: any): void {
    // if (JSON.stringify(this.filters) !== '{}') {
    this.perPage = event.target.value;
    this.page = 1;
    this.getCompanies();
    // }
  }

  onSearch(searchText: string): void {
    this.searchText = searchText;
    console.log('Search initiated with text:', this.searchText);
    this.filters.searchTerm = this.searchText;
    this.getCompanies();
  }

  clearSearch(): void {
    this.searchText = '';
    this.filters.searchTerm = this.searchText;
    this.getCompanies();
  }

  openModal(content: TemplateRef<any>, company: any) {
    this.selectedCompany = company;
    console.log(this.selectedCompany);
    this.modalService.open(content, {
      centered: false,
      size: 'lg',
      scrollable: false,
    });
  }
}
