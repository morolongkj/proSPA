import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CompanyService } from '../_services/company.service';

export const companyDetailsResolver: ResolveFn<boolean> = (route, state) => {
  const companyId = route.paramMap.get('id'); // Get the company id from the route parameters
  if (companyId) {
    return inject(CompanyService).getCompany(companyId); // Call the service method to get the company by id
  }
  return false; // Or handle the case where no company id is found
};
