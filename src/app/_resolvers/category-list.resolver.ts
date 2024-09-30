import { ResolveFn } from '@angular/router';
import { CategoryService } from '../_services/category.service';
import { inject } from '@angular/core';

export const categoryListResolver: ResolveFn<boolean> = (route, state) => {
  return inject(CategoryService).getCategories();
};
