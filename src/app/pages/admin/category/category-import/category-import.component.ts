import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../_services/category.service';
import { ExcelService } from '../../../../_services/excel.service';
import { ToastService } from '../../../../_services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReadExcelComponent } from '../../../../_shared/read-excel/read-excel.component';

@Component({
  selector: 'app-category-import',
  standalone: true,
  providers: [],
  imports: [
    AsyncPipe,
    RouterLink,
    CommonModule,
    ReadExcelComponent,
  ],
  templateUrl: './category-import.component.html',
  styleUrl: './category-import.component.css'
})
export class CategoryImportComponent {
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private excelService = inject(ExcelService);

  handleData(data: any) {
    console.log('Data received from ReadExcelComponent:', data);
    this.categoryService.addCategories(data).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Categories uploaded successfully!');
          this.router.navigate(['/categories']);
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
    const data = [
      {title:''},
    ];
    this.excelService.downloadExcelFile(data, 'categories_template.xlsx');
  }
}
