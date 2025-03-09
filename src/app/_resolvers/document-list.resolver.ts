import { ResolveFn } from '@angular/router';
import { DocumentService } from '../_services/document.service';
import { inject } from '@angular/core';

export const documentListResolver: ResolveFn<boolean> = (route, state) => {
  return inject(DocumentService).getDocuments();
};
