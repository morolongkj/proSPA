import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '../_services/product.service';

export const productListResolver: ResolveFn<boolean> = (route, state) => {
  return inject(ProductService).getProducts();
};
