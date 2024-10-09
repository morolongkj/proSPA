import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CompanyService } from '../_services/company.service';

export const CompanyListResolver: ResolveFn<boolean> = (route, state) => {
  return inject(CompanyService).getCompanies();
};
