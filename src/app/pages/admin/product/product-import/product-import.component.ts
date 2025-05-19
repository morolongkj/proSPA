import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../_services/product.service';
import { ExcelService } from '../../../../_services/excel.service';
import { ToastService } from '../../../../_services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReadExcelComponent } from '../../../../_shared/read-excel/read-excel.component';

@Component({
  selector: 'app-product-import',
  standalone: true,
  providers: [],
  imports: [AsyncPipe, RouterLink, CommonModule, ReadExcelComponent],
  templateUrl: './product-import.component.html',
  styleUrl: './product-import.component.css',
})
export class ProductImportComponent {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private excelService = inject(ExcelService);

  handleData(data: any) {
    console.log('Data received from ReadExcelComponent:', data);
    this.productService.addProducts(data).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Products uploaded successfully!');
          this.router.navigate(['/products']);
        } else {
          this.toastService.error('Unknown error occured');
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  downloadFile() {
    const data = [{ code: '', title: '' }];
    this.excelService.downloadExcelFile(data, 'products_template.xlsx');
  }
}
