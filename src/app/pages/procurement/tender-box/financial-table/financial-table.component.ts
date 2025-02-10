import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../_services/api.service';
import AOS from 'aos';
import { CommonModule } from '@angular/common';
import { ColumnChartComponent } from '../../../_components/column-chart/column-chart.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportToExcelService } from '../../../../_services/export-to-excel.service';

@Component({
  selector: 'app-financial-table',
  standalone: true,
  imports: [CommonModule, RouterLink, ColumnChartComponent],
  templateUrl: './financial-table.component.html',
  styleUrl: './financial-table.component.css',
})
export class FinancialTableComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private modalService = inject(NgbModal);
  private exportToExcelService = inject(ExportToExcelService);

  tender: any = {};

  financial_evaluation: any[] = []; // Array to hold fetched bids data

  isLoading = false;
  errorMessage = '';

  selectedProduct: any = {};
  chartData = [
    { name: 'Company A', data: [50, 70, 90] },
    { name: 'Company B', data: [40, 60, 80] },
  ];

  chartCategories = ['Product 1', 'Product 2', 'Product 3'];

  constructor() {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.log(data);
      this.tender = data['tender'];
      this.loadProducts();
    });
    AOS.init();
  }

  loadProducts() {
    this.isLoading = true;
    const params: any = {};

    this.apiService
      .get('/bids/financial-evaluation/' + this.tender.id, params)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.financial_evaluation = response.financial_evaluation;
          this.isLoading = false;
          this.errorMessage = '';
          console.log(this.financial_evaluation);
        },
        error: (err: any) => {
          console.log(err);
          this.errorMessage =
            'Failed to fetch the financial_evaluation. Please check your connection or try again later.';
          this.isLoading = false;
        },
      });
  }

  visualizeData(product: any, content: TemplateRef<any>) {
    this.selectedProduct = product;
    console.log(this.selectedProduct);
    const { chartData, chartCategories } = this.transformBidData(
      this.selectedProduct.bids
    );
    console.log(chartData, chartCategories);
    this.chartCategories = chartCategories;
    this.chartData = chartData;
    this.modalService.open(content, { size: 'xl' });
  }

  transformBidData(bids: any[]): {
    chartData: any[];
    chartCategories: string[];
  } {
    // Define the categories based on object keys
    const chartCategories = [
      'Total Price',
      'Unit Pack',
      'Quantity Offered',
      'Unit Price',
      'Lead Time',
    ];

    // Transform bid data
    const chartData = bids.map((bid) => ({
      name: bid.company_name,
      data: [
        parseFloat(bid.total_price), // Total Price
        parseInt(bid.unit_pack, 10), // Unit Pack
        parseInt(bid.quantity_offered, 10), // Quantity Offered
        parseFloat(bid.unit_price), // Unit Price
        parseInt(bid.lead_time, 10), // Lead Time
      ],
    }));

    return { chartData, chartCategories };
  }

  exportToExcel(product: any) {
    this.selectedProduct = product;
    this.exportToExcelService.exportBidsToExcel(this.selectedProduct.bids);
  }
}
