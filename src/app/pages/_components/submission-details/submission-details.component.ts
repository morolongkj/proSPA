import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-submission-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submission-details.component.html',
  styleUrl: './submission-details.component.css',
})
export class SubmissionDetailsComponent {
  @Input() submissionData: any = {};
  @Output() selectionChanged = new EventEmitter<string[]>();
  errorMessage: string = '';

  selectedProducts: any[] = [];

  toggleProductSelection(product: any, event: any) {
    if (event.target.checked) {
      // Add product if not already in the list
      if (!this.selectedProducts.find((p) => p.id === product.id)) {
        this.selectedProducts.push(product);
      }
    } else {
      // Remove product if unchecked
      this.selectedProducts = this.selectedProducts.filter(
        (p) => p.id !== product.id
      );
    }

    // Emit the selected products to parent component
    this.emitSelection();
  }

  emitSelection() {
    this.selectionChanged.emit(this.selectedProducts);
  }

  downloadFile(filePath: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  }

  downloadAll(): void {
    if (this.submissionData?.attachments?.length > 0) {
      // Iterate over each attachment
      this.submissionData.attachments.forEach(
        (attachment: any, index: number) => {
          // Create a temporary anchor element for downloading
          const link = document.createElement('a');
          link.href = attachment.file_path;
          link.download = attachment.file_name;

          // Delay each download slightly to avoid browser throttling (optional)
          setTimeout(() => {
            link.click();
          }, index * 200); // 200ms delay between downloads
        }
      );
    } else {
      alert('No attachments available to download.');
    }
  }
}
