import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import AOS from 'aos';
import { ApiService } from '../../../../_services/api.service';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tender-box-details',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, RouterLink],
  templateUrl: './tender-box-details.component.html',
  styleUrl: './tender-box-details.component.css',
})
export class TenderBoxDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  tender: any = {};

  bids: any[] = []; // Array to hold fetched bids data
  perPageOptions = [5, 10, 25, 50, 100, 150, 250, 500, 1000];
  pagination: { currentPage: number; totalPages: number } = {
    currentPage: 1,
    totalPages: 1,
  };
  perPage = 100;
  sortField = 'created_at'; // Sort field
  sortOrder = 'ASC'; // Sort order
  // status = 'Closed'; // Status filter
  filters = {
    tender_id: this.tender.id || null,
    company_id: '',
    searchTerm: '',
  };

  isLoading = false;
  errorMessage = '';

  isDownloading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.log(data);
      this.tender = data['tender'];
      this.filters.tender_id = this.tender.id;
      this.loadBids();
    });
    AOS.init();
  }

  loadBids() {
    this.isLoading = true;
    const params: any = {
      perPage: this.perPage,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      page: this.pagination.currentPage,
    };
    // Add filters to params only if they are not empty

    if (this.filters.tender_id) {
      params.tender_id = this.filters.tender_id;
    }

    this.apiService.get('/bids', params).subscribe({
      next: (response: any) => {
        console.log(response);
        this.bids = response.data.bids;
        this.pagination = {
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
        };
        this.isLoading = false;
        this.errorMessage = '';
        console.log(this.bids);
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage =
          'Failed to fetch bids. Please check your connection or try again later.';
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
    this.loadBids();
  }

  changePage(newPage: number): void {
    if (newPage <= this.pagination.totalPages && newPage >= 1) {
      this.pagination.currentPage = newPage;
    }
  }

  changePerPage() {
    this.pagination.currentPage = 1; // Reset to first page when perPage changes
    this.loadBids();
  }

  hasActiveFilters(): boolean {
    // Check if any of the search filters are set
    return !!(this.filters.company_id || this.filters.searchTerm);
  }

  clearFilters() {
    // Reset search filters
    this.filters = {
      company_id: '',
      searchTerm: '',
      tender_id: this.tender.id,
    };
    // Reset to the first page and fetch questions again
    this.pagination.currentPage = 1;
    this.loadBids();
  }

  // downloadAllAttachments(bid: any) {
  //   if (bid.attachments && bid.attachments.length > 0) {
  //     bid.attachments.forEach((attachment: any) => {
  //       const link = document.createElement('a');
  //       link.href = attachment.url;
  //       link.download = attachment.name;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     });
  //   }
  // }

  async downloadAllAttachments(bid: any) {
    if (!bid.attachments || bid.attachments.length === 0) return;

    this.isDownloading = true; // Show loading indicator

    const zip = new JSZip();
    const downloadPromises = bid.attachments.map(async (attachment: any) => {
      try {
        const response = await fetch(attachment.file_path);
        const blob = await response.blob();
        zip.file(attachment.file_name, blob);
      } catch (error) {
        console.error(`Failed to download ${attachment.file_name}:`, error);
      }
    });

    await Promise.all(downloadPromises);
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    saveAs(zipBlob, bid.company_name+'attachments.zip');
    this.isDownloading = false; // Hide loading indicator
  }
}
