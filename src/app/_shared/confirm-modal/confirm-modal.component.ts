import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  title: string = '';
  message: string = '';

  @Output() onClose = new EventEmitter<boolean>();
  constructor(public activeModal: NgbActiveModal) {}
  confirm(result: boolean) {
    this.onClose.emit(result);
    this.activeModal.close();
  }
}
