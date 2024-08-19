import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}
  success(message: string, title = 'Success') {
    this.toastr.success(message, title, {
      positionClass: 'toast-top-right',
    });
  }
  info(message: string, title = 'Info') {
    this.toastr.info(message, title, {
      positionClass: 'toast-top-right',
    });
  }
  warning(message: string, title = 'Warning') {
    this.toastr.warning(message, title, {
      positionClass: 'toast-top-right',
    });
  }
  error(message: string, title = 'Error') {
    this.toastr.error(message, title, {
      positionClass: 'toast-top-right',
    });
  }
}
