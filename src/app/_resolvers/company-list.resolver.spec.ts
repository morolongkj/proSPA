import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { companyListResolver } from './company-list.resolver';

describe('companyListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => companyListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
