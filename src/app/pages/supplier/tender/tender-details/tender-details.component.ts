import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tender-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tender-details.component.html',
  styleUrl: './tender-details.component.css',
})
export class TenderDetailsComponent {
  @Input() tender: any;

  // Download attachment method
  downloadAttachment(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }
}
