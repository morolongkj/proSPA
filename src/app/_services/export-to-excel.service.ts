import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportToExcelService {
  exportBidsToExcel(bids: any[], fileName: string = 'bids.xlsx') {
    // Convert data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(bids);

    // Create workbook and append worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { Bids: worksheet },
      SheetNames: ['Bids'],
    };

    // Generate Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save file
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, fileName);
  }
}
