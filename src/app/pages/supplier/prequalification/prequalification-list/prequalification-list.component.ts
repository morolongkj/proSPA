import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-prequalification-list',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './prequalification-list.component.html',
  styleUrl: './prequalification-list.component.css'
})
export class PrequalificationListComponent {
  questionnaires: any[] = [
    {
      id: '',
      prequalificationNotice:
        'Pre-Qualification of Suppliers for Medical Supplies and Equipment',
      dateOfSubmission: '18/04/2024',
      status: 'Submitted',
    },
    {
      id: '',
      prequalificationNotice:
        'Pre-Qualification of Suppliers for Medical Supplies and Equipment',
      dateOfSubmission: '01/01/2024',
      status: 'Rejected',
    },
    {
      id: '',
      prequalificationNotice:
        'Pre-Qualification of Suppliers for Laboratory Equipment / Consumables / Diagnostics',
      dateOfSubmission: '16/02/2024',
      status: 'Approved, waiting for samples',
    },
    {
      id: '',
      prequalificationNotice:
        'Pre-Qualification of Suppliers for Rehabilitation/Emergency Supplies',
      dateOfSubmission: '03/04/2024',
      status: 'In Review',
    },
    {
      id: '',
      prequalificationNotice:
        'Pre-Qualification of Suppliers for Office Stationery',
      dateOfSubmission: '04/02/2024',
      status: 'In Review',
    },
  ];

  pageSize: number = 4;
  currentPage: number = 1;
  totalQuestionnaires: number = 5;
  pageSizes = [4, 8, 16, 20];

  constructor(private modalService: NgbModal) {}

  handlePageChange(event: any): void {
    this.currentPage = event;
    // this.loadItems();
  }

  handlePageSizeChange(event: any): void {
    // if (JSON.stringify(this.filters) !== '{}') {
    this.pageSize = event.target.value;
    this.currentPage = 1;
    // this.loadItems();
    // }
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
