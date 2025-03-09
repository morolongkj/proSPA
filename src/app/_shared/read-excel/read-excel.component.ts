import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ExcelService } from '../../_services/excel.service';

interface DataObject {
  [key: string]: any;
}
@Component({
  selector: 'app-read-excel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './read-excel.component.html',
  styleUrl: './read-excel.component.css'
})
export class ReadExcelComponent {
  excelData: any[] = [];
  totalColumns: number = 0;

  private excelService = inject(ExcelService);
  @Output() dataEmitted: EventEmitter<any[]> = new EventEmitter<any[]>();

  readFile(file: any) {
    this.excelService.readExcelFile(file).then((data) => {
      this.excelData = data;
      this.totalColumns = this.excelData[0]?.length || 0;

    }).catch((error) => {
      console.error('Error reading the Excel file:', error);
    });
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
this.readFile(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files[0];
    if (file) {
      console.log('File dropped:', file);
      // Handle file processing here
      this.readFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Optionally add some visual feedback
    (event.currentTarget as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Remove visual feedback
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  uploadData() {
    console.log(this.excelData);
    if (this.excelData.length === 0) {
      console.error('No data available.');
      return;
    }
    // Extract keys from the first row
    const keys: string[] = this.excelData[0];
    const result: DataObject[] = [];
    // Process each row starting from the second row
    for (let i = 1; i < this.excelData.length; i++) {
      const row = this.excelData[i];
      const obj: DataObject = {};
      // Create an object for the current row using keys
      for (let j = 0; j < keys.length; j++) {
        obj[keys[j]] = row[j] || null;
      }
      result.push(obj);
    }
    this.dataEmitted.emit(result);
  }

}
