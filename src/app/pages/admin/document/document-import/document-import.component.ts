import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DocumentService } from '../../../../_services/document.service';
import { ExcelService } from '../../../../_services/excel.service';
import { ToastService } from '../../../../_services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReadExcelComponent } from '../../../../_shared/read-excel/read-excel.component';

@Component({
  selector: 'app-document-import',
  standalone: true,
  providers: [],
  imports: [AsyncPipe, RouterLink, CommonModule, ReadExcelComponent],
  templateUrl: './document-import.component.html',
  styleUrl: './document-import.component.css',
})
export class DocumentImportComponent {
  private documentService = inject(DocumentService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private excelService = inject(ExcelService);

  handleData(data: any) {
    console.log('Data received from ReadExcelComponent:', data);
    this.documentService.addDocuments(data).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res['status']) {
          //successful
          this.toastService.success('Documents uploaded successfully!');
          this.router.navigate(['/documents']);
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
    const data = [{ title: '' }];
    this.excelService.downloadExcelFile(data, 'documents_template.xlsx');
  }
}
