import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TenderService } from '../_services/tender.service';

export const tenderDetailsResolver: ResolveFn<boolean> = (route, state) => {
  const tenderId = route.paramMap.get('id'); // Get the tender id from the route parameters
  if (tenderId) {
    return inject(TenderService).getTender(tenderId); // Call the service method to get the tender by id
  }
  return false; // Or handle the case where no tender id is found
};
