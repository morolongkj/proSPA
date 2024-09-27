import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../_shared/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(private modalService: NgbModal) {}

  confirm(title: string, message: string): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;

    return new Promise<boolean>((resolve) => {
      modalRef.componentInstance.onClose.subscribe((result: boolean) => {
        resolve(result);
      });
    });
  }
}
