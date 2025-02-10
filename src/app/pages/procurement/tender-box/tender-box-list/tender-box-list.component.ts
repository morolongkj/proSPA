import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../../_services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tender-box-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tender-box-list.component.html',
  styleUrl: './tender-box-list.component.css',
})
export class TenderBoxListComponent implements OnInit {
  private apiService = inject(ApiService);

  tenderBoxes: any[] = []; // Array to hold fetched tenderBoxes data
  perPageOptions = [5, 10, 25, 50, 100, 150, 250, 500, 1000];
  pagination: { currentPage: number; totalPages: number } = {
    currentPage: 1,
    totalPages: 1,
  };
  perPage = 5;
  sortField = 'created_at'; // Sort field
  sortOrder = 'DESC'; // Sort order
  // status = 'Closed'; // Status filter
  filters = {
    reference_number: '',
    title: '',
    status: 'Closed',
  };

  isLoading = false;
  errorMessage = '';

  constructor() {}

  ngOnInit(): void {
    this.loadTenderBoxes();
  }

  loadTenderBoxes() {
    this.isLoading = true;
    const params: any = {
      perPage: this.perPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      page: this.pagination.currentPage,
    };
    // Add filters to params only if they are not empty

    if (this.filters.status) {
      params.status = this.filters.status;
    }

    if (this.filters.reference_number) {
      params.reference_number = this.filters.reference_number;
    }

    if (this.filters.title) {
      params.title = this.filters.title;
    }

    this.apiService.get('/tenders', params).subscribe({
      next: (response: any) => {
        console.log(response);
        this.tenderBoxes = response.data.tenders;
        this.pagination = {
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
        };
        this.isLoading = false;
        this.errorMessage = '';
        console.log(this.tenderBoxes);
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage =
          'Failed to fetch tenderBoxes. Please check your connection or try again later.';
        this.isLoading = false;
      },
    });
  }

  sort(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortField = field;
      this.sortOrder = 'ASC';
    }
    this.loadTenderBoxes();
  }

  changePage(newPage: number): void {
    if (newPage <= this.pagination.totalPages && newPage >= 1) {
      this.pagination.currentPage = newPage;
    }
  }

  changePerPage() {
    this.pagination.currentPage = 1; // Reset to first page when perPage changes
    this.loadTenderBoxes();
  }

  hasActiveFilters(): boolean {
    // Check if any of the search filters are set
    return !!(this.filters.reference_number || this.filters.title);
  }

  clearFilters() {
    // Reset search filters
    this.filters = {
      reference_number: '',
      title: '',
      status: 'Closed',
    };
    // Reset to the first page and fetch questions again
    this.pagination.currentPage = 1;
    this.loadTenderBoxes();
  }
}
